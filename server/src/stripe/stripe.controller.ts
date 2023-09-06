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
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}
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
  @Post('webhook')
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

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody.toString(),
        signature,
        this.configService.get('WEBHOOK_SIGNING_SECRET') as string,
      );
      console.log(event);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle the successful payment intent here
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        // Handle the successful attachment of a PaymentMethod here
        break;
      // Handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
