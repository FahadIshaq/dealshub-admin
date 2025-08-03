import { IsEmail, IsNotEmpty } from 'class-validator';

export class InvestorLoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
} 