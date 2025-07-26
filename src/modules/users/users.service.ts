import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../models/user.model';
import { CreateUserDto, UserRole } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if passwords match
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Split full name into first and last name
    const nameParts = createUserDto.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
      firstName,
      lastName,
      roles: createUserDto.roles,
      isActive: createUserDto.isActive ?? true,
      isVerified: false, // New users need email verification
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, validate it
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      // Check if both password fields are provided
      if (!updateUserDto.password || !updateUserDto.confirmPassword) {
        throw new BadRequestException('Both password and confirmPassword must be provided when updating password');
      }

      // Check password length
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }

      if (updateUserDto.confirmPassword.length < 6) {
        throw new BadRequestException('Confirm password must be at least 6 characters long');
      }

      // Check if passwords match
      if (updateUserDto.password !== updateUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
      }
    }

    const updateData: any = {};

    if (updateUserDto.fullName) {
      const nameParts = updateUserDto.fullName.split(' ');
      updateData.firstName = nameParts[0] || '';
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    if (updateUserDto.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser._id?.toString() !== id) {
        throw new BadRequestException('Email already in use');
      }
      updateData.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.roles) {
      updateData.roles = updateUserDto.roles;
    }

    if (updateUserDto.isActive !== undefined) {
      updateData.isActive = updateUserDto.isActive;
    }

    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userModel.find({ roles: role }).select('-password').exec();
  }

  async toggleUserStatus(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.findByIdAndUpdate(
      id, 
      { isActive: !user.isActive }, 
      { new: true }
    ).select('-password').exec();
  }
} 