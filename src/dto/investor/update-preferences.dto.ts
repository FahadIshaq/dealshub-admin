import {
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
  Min,
  Max,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PriceRangeDto {
  @IsNumber()
  @Min(0)
  min: number;

  @IsNumber()
  @Min(0)
  max: number;
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  propertyTypes?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PriceRangeDto)
  priceRange?: PriceRangeDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  bathrooms?: number;
} 