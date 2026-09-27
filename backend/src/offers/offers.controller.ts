import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { OffersService } from './offers.service.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CreateOfferEventDto } from './dto/create-offer-event.dto.js';

@Controller()
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
  ) {}

  @Post('products/:productId/offers')
  create(
    @Param('productId') productId: string,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offersService.create(
      productId,
      createOfferDto,
    );
  }

  @Get('products/:productId/offers')
  findByProduct(
    @Param('productId') productId: string,
  ) {
    return this.offersService.findByProduct(
      productId,
    );
  }

  @Get('offers/:id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Post('offers/:offerId/events')
  createEvent(
    @Param('offerId') offerId: string,
    @Body() createOfferEventDto: CreateOfferEventDto,
  ) {
    return this.offersService.createEvent(
      offerId,
      createOfferEventDto,
    );
  }

}

