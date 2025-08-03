import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsMongoId,
} from 'class-validator';

export class CreateOfferDto {
  @IsMongoId({ message: 'Property ID must be a valid MongoDB ID' })
  @IsNotEmpty({ message: 'Property ID is required' })
  propertyId: string;

  @IsNumber({}, { message: 'Offer amount must be a number' })
  @Min(1, { message: 'Offer amount must be greater than 0' })
  @IsNotEmpty({ message: 'Offer amount is required' })
  offerAmount: number;

  @IsString({ message: 'Message must be a string' })
  @IsOptional()
  message?: string;

  @IsString({ message: 'Terms must be a string' })
  @IsOptional()
  terms?: string;

  @IsNumber({}, { message: 'Contingencies must be a number' })
  @IsOptional()
  contingencies?: number;
} 