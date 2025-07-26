import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, required: false })
  otp: string | null;

  @Prop({ type: Date, required: false })
  otpExpiry: Date | null;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop({ 
    type: [String], 
    enum: ['deposition_manager', 'acquisition_manager', 'administrator'],
    default: ['deposition_manager'] 
  })
  roles: string[];

  @Prop({ 
    type: String, 
    enum: ['deposition_manager', 'acquisition_manager', 'administrator'],
    required: false
  })
  role: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); 