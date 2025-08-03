import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OfferDocument = Offer & Document;

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COUNTER_OFFER = 'counter_offer',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Offer {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Investor', required: true })
  investorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  propertyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  wholesalerId: Types.ObjectId;

  @Prop({ required: true })
  offerAmount: number;

  @Prop()
  message: string;

  @Prop()
  terms: string;

  @Prop()
  contingencies: number;

  @Prop({ 
    type: String, 
    enum: OfferStatus, 
    default: OfferStatus.PENDING 
  })
  status: OfferStatus;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: Date })
  acceptedAt: Date;

  @Prop({ type: Date })
  rejectedAt: Date;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Number })
  counterOfferAmount: number;

  @Prop()
  counterOfferMessage: string;

  createdAt: Date;
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer); 