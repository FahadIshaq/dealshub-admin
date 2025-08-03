import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { Investor, InvestorSchema } from '../../models/investor.model';
import { Offer, OfferSchema } from '../../models/offer.model';
import { Message, MessageSchema } from '../../models/message.model';
import { Review, ReviewSchema } from '../../models/review.model';
import { Property, PropertySchema } from '../../models/property.model';
import { User, UserSchema } from '../../models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Property.name, schema: PropertySchema },
      { name: User.name, schema: UserSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    MailerModule,
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService],
  exports: [InvestorsService],
})
export class InvestorsModule {} 