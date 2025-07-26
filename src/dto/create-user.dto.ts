import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum UserRole {
  DEPOSITION_MANAGER = 'deposition_manager',
  ACQUISITION_MANAGER = 'acquisition_manager',
  ADMINISTRATOR = 'administrator',
}

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsEnum(UserRole, { each: true })
  @IsNotEmpty()
  roles: UserRole[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 