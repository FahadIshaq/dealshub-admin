import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyInvestorOtpDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  otp: string;
} 