import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum OfferEventType {
  ACCEPT = 'ACCEPT',
  COUNTEROFFER = 'COUNTEROFFER',
  REJECT = 'REJECT',
  RETRACT = 'RETRACT',
}

export enum OfferActorRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

export class CreateOfferEventDto {
  @IsEnum(OfferEventType)
  eventType: OfferEventType;

  @IsEnum(OfferActorRole)
  actorRole: OfferActorRole;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @IsOptional()
  @IsString()
  respondsToEventId?: string;
}