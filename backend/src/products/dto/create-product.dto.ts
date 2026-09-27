import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus } from '../../generated/prisma/enums.js';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  shop!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  originalPrice!: number;
  // Because the request is now multipart/form-data, originalPrice initially arrives from the browser as a string.
  // 'transform: true' in main.ts to convert the string to a number

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}