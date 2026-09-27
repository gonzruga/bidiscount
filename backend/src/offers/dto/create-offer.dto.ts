import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export enum FulfillmentMethod {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
  BOTH = 'BOTH',
}

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  buyerName: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  endDate: string;

  @IsEnum(FulfillmentMethod)
  fulfillmentMethod: FulfillmentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

