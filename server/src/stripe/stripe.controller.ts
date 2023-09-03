import {
  BadRequestException,
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
  Headers,
  Get,
} from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { StripeService } from './stripe.service';
import { CartService } from '../cart/cart.service';
import Response from 'express';
import { stripe } from '../main';
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('create-payment-intent')
  async getSecret(@Body() arrSumDto: { arrSum: number }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: arrSumDto.arrSum * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent.client_secret;
  }
  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header.');
    }
    if (!req.rawBody) {
      throw new BadRequestException('Invalid payload');
    }
    const raw = req.rawBody.toString('utf8');

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      raw,
    );

    // ...
  }
}
