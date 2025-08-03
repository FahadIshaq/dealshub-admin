import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class SendMessageDto {
  @IsMongoId({ message: 'Recipient ID must be a valid MongoDB ID' })
  @IsNotEmpty({ message: 'Recipient ID is required' })
  recipientId: string;

  @IsString({ message: 'Subject must be a string' })
  @IsNotEmpty({ message: 'Subject is required' })
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  subject: string;

  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  message: string;

  @IsMongoId({ message: 'Property ID must be a valid MongoDB ID' })
  @IsOptional()
  propertyId?: string;
} 