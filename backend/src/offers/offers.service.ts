import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CreateOfferEventDto } from './dto/create-offer-event.dto.js';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    productId: string,
    createOfferDto: CreateOfferDto,
  ) {
    // Check that the product exists
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found`,
      );
    }

    // Do not allow offers on unavailable products
    if (product.status !== 'AVAILABLE') {
      throw new BadRequestException(
        'This product is not available for offers',
      );
    }

    // Validate end date
    const endDate = new Date(
      createOfferDto.endDate,
    );

    if (Number.isNaN(endDate.getTime())) {
      throw new BadRequestException(
        'Invalid offer end date',
      );
    }

    if (endDate <= new Date()) {
      throw new BadRequestException(
        'Offer end date must be in the future',
      );
    }

    // Validate amount
    if (createOfferDto.amount <= 0) {
      throw new BadRequestException(
        'Offer amount must be greater than zero',
      );
    }

    return this.prisma.offer.create({
      data: {
        productId,

        buyerName:
          createOfferDto.buyerName,

        amount: createOfferDto.amount,

        endDate,

        fulfillmentMethod:
          createOfferDto.fulfillmentMethod,

        remarks:
          createOfferDto.remarks,

        status: 'PENDING',
      },

      include: {
        product: true,
      },
    });
  }

  async findByProduct(productId: string) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        `Product with ID "${productId}" not found`,
      );
    }

    return this.prisma.offer.findMany({
      where: {
        productId,
      },
      include: {
        events: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const offer =
      await this.prisma.offer.findUnique({
        where: {
          id,
        },
        include: {
          product: true,
          events: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

    if (!offer) {
      throw new NotFoundException(
        `Offer with ID "${id}" not found`,
      );
    }

    return offer;
  }

async createEvent(
  offerId: string,
  createOfferEventDto: CreateOfferEventDto,
) {
  const offer = await this.prisma.offer.findUnique({
    where: {
      id: offerId,
    },
    include: {
      events: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!offer) {
    throw new NotFoundException(
      `Offer with ID "${offerId}" not found`,
    );
  }

  if (
  offer.status === 'ACCEPTED' ||
  offer.status === 'REJECTED' ||
  offer.status === 'RETRACTED'
) {
  throw new BadRequestException(
    `This offer has already been ${offer.status.toLowerCase()}.`,
  );
}

  const {
    eventType,
    actorRole,
    amount,
    endDate,
    remarks,
    respondsToEventId,
  } = createOfferEventDto;

  /*
   * Determine the current amount.
   *
   * Offer.amount remains permanently unchanged.
   *
   * If there are counteroffers, the latest event
   * containing an amount becomes the current amount.
   */
  const latestAmountEvent = offer.events.find(
    (event) => event.amount !== null,
  );

  const currentAmount =
    latestAmountEvent?.amount ??
    offer.amount;

  /*
   * Validate respondsToEventId.
   *
   * It is primarily relevant to COUNTEROFFER.
   */
  if (respondsToEventId) {
    const responseEvent =
      await this.prisma.offerEvent.findFirst({
        where: {
          id: respondsToEventId,
          offerId,
        },
      });

    if (!responseEvent) {
      throw new BadRequestException(
        'The event being responded to does not belong to this offer.',
      );
    }
  }

  /*
   * COUNTEROFFER
   *
   * Must have:
   * - amount
   * - endDate
   *
   * Its amount becomes the new current amount.
   */
  if (eventType === 'COUNTEROFFER') {
    if (amount === undefined || amount <= 0) {
      throw new BadRequestException(
        'Counteroffer amount must be greater than zero.',
      );
    }

    if (!endDate) {
      throw new BadRequestException(
        'Counteroffer end date is required.',
      );
    }

    const parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException(
        'Invalid counteroffer end date.',
      );
    }

    if (parsedEndDate <= new Date()) {
      throw new BadRequestException(
        'Counteroffer end date must be in the future.',
      );
    }

    /*
     * If this counteroffer does not explicitly identify
     * what it responds to, respond to the latest event type COUNTEROFFER.
     */
    const latestCounteroffer = offer.events.find(
      (event) =>
        event.eventType === 'COUNTEROFFER',
    );

    const responseId =
      respondsToEventId ??
      latestCounteroffer?.id ??
      null;

    const event =
      await this.prisma.offerEvent.create({
        data: {
          offerId,
          eventType: 'COUNTEROFFER',
          actorRole,
          amount,
          endDate: parsedEndDate,
          remarks: remarks?.trim() || undefined,
          respondsToEventId: responseId,
        },
      });

    await this.prisma.offer.update({
      where: {
        id: offerId,
      },
      data: {
        status: 'NEGOTIATION',
      },
    });

    return event;
  }

  /*
   * ACCEPT / REJECT / RETRACT
   *
   * These events inherit the current amount.
   *
   * They do NOT change Offer.amount.
   *
   * They do NOT receive a new endDate.
   */

  if (
    eventType === 'ACCEPT' ||
    eventType === 'REJECT' ||
    eventType === 'RETRACT'
  ) {
    let newStatus:
      | 'ACCEPTED'
      | 'REJECTED'
      | 'RETRACTED';

    if (eventType === 'ACCEPT') {
      newStatus = 'ACCEPTED';
    } else if (eventType === 'REJECT') {
      newStatus = 'REJECTED';
    } else {
      newStatus = 'RETRACTED';
    }

    const event = await this.prisma.$transaction(
      async (tx) => {
        const createdEvent = await tx.offerEvent.create({
          data: {
            offerId,
            eventType,
            actorRole,
            amount: currentAmount,
            remarks: remarks?.trim() || undefined,
            respondsToEventId: respondsToEventId ?? null,
          },
        });

        await tx.offer.update({
          where: {
            id: offerId,
          },
          data: {
            status: newStatus,
          },
        });

        return createdEvent;
      },
    );

    return event;
  }

  throw new BadRequestException(
    'Invalid offer event type.',
  );

  }

}

