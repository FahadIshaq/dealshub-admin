import {
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UpdateInvestorDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @IsOptional()
  @IsBoolean({ message: 'Receive texts must be a boolean value' })
  receiveTexts?: boolean;
} 