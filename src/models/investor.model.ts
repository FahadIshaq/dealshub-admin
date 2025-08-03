import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  _id: Types.ObjectId;
  
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, required: false })
  otp: string | null;

  @Prop({ type: Date, required: false })
  otpExpiry: Date | null;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  phone: string;

  @Prop({ default: false })
  receiveTexts: boolean;

  @Prop({ default: false })
  termsAccepted: boolean;

  @Prop({ default: false })
  privacyAccepted: boolean;

  @Prop()
  stripeCustomerId: string;

  @Prop()
  stripePaymentMethodId: string;

  @Prop({ type: [String], default: [] })
  savedProperties: string[];

  @Prop({ type: [String], default: [] })
  favoriteProperties: string[];

  @Prop({ type: Object, default: {} })
  preferences: {
    propertyTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locations: string[];
    bedrooms: number;
    bathrooms: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor); 