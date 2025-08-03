import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Delete,
  Body, 
  UseGuards, 
  Request, 
  Param,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from '../../dto/investor/create-investor.dto';
import { InvestorLoginDto } from '../../dto/investor/investor-login.dto';
import { VerifyInvestorOtpDto } from '../../dto/investor/verify-investor-otp.dto';
import { CreateOfferDto } from '../../dto/investor/create-offer.dto';
import { SendMessageDto } from '../../dto/investor/send-message.dto';
import { UpdateInvestorDto } from '../../dto/investor/update-investor.dto';
import { UpdatePreferencesDto } from '../../dto/investor/update-preferences.dto';
import { JwtAuthGuard } from '../../middleware/jwt.guard';
import { InvestorGuard } from '../../middleware/investor.guard';

@Controller('investors')
export class InvestorsController {
  constructor(private readonly investorsService: InvestorsService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createInvestorDto: CreateInvestorDto) {
    return this.investorsService.signup(createInvestorDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: InvestorLoginDto) {
    return this.investorsService.login(loginDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() verifyOtpDto: VerifyInvestorOtpDto) {
    return this.investorsService.verifyOTP(verifyOtpDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyOtpDto: VerifyInvestorOtpDto) {
    return this.investorsService.verifyEmail(verifyOtpDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() body: { email: string }) {
    return this.investorsService.resendOTP(body.email);
  }

  @Get('profile')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    return this.investorsService.getProfile(req.user.sub);
  }

  @Put('profile')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() updateData: UpdateInvestorDto) {
    return this.investorsService.updateProfile(req.user.sub, updateData);
  }

  // Offer related endpoints
  @Post('offers')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.CREATED)
  async makeOffer(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    return this.investorsService.makeOffer(req.user.sub, createOfferDto);
  }

  @Get('offers')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getMyOffers(@Request() req) {
    return this.investorsService.getMyOffers(req.user.sub);
  }

  @Get('offers/:id')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getOfferDetails(@Request() req, @Param('id') offerId: string) {
    return this.investorsService.getOfferDetails(offerId, req.user.sub);
  }

  // Messaging endpoints
  @Post('messages')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.investorsService.sendMessage(req.user.sub, sendMessageDto);
  }

  @Get('messages')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getMessages(@Request() req) {
    return this.investorsService.getMessages(req.user.sub);
  }

  @Put('messages/:id/read')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async markMessageAsRead(@Request() req, @Param('id') messageId: string) {
    return this.investorsService.markMessageAsRead(messageId, req.user.sub);
  }

  // Reviews endpoints
  @Get('wholesalers/:id/reviews')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getWholesalerReviews(@Param('id') wholesalerId: string) {
    return this.investorsService.getWholesalerReviews(wholesalerId);
  }

  @Get('wholesalers/:id/rating')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getWholesalerRating(@Param('id') wholesalerId: string) {
    return this.investorsService.getWholesalerRating(wholesalerId);
  }

  // Property management endpoints
  @Post('properties/:id/save')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async saveProperty(@Request() req, @Param('id') propertyId: string) {
    return this.investorsService.saveProperty(req.user.sub, propertyId);
  }

  @Delete('properties/:id/save')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async removeSavedProperty(@Request() req, @Param('id') propertyId: string) {
    return this.investorsService.removeSavedProperty(req.user.sub, propertyId);
  }

  @Get('properties/saved')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async getSavedProperties(@Request() req) {
    return this.investorsService.getSavedProperties(req.user.sub);
  }

  @Put('preferences')
  @UseGuards(InvestorGuard)
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@Request() req, @Body() preferences: UpdatePreferencesDto) {
    return this.investorsService.updatePreferences(req.user.sub, preferences);
  }
} 