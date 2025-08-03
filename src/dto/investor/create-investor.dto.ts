import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  IsBoolean, 
  IsOptional,
  Matches,
  IsString,
  MaxLength
} from 'class-validator';

export class CreateInvestorDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  password: string;

  @IsOptional()
  @IsBoolean({ message: 'Receive texts must be a boolean value' })
  receiveTexts?: boolean;

  @IsNotEmpty({ message: 'You must accept the Terms of Service' })
  @IsBoolean({ message: 'Terms acceptance must be a boolean value' })
  termsAccepted: boolean;

  @IsNotEmpty({ message: 'You must accept the Privacy Policy' })
  @IsBoolean({ message: 'Privacy acceptance must be a boolean value' })
  privacyAccepted: boolean;
} 