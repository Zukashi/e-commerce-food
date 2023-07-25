import {
  BadRequestException,
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { StripeService } from './stripe.service';
import { CartService } from '../cart/cart.service';
import Response from 'express';
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('checkout/session')
  async redirectToCheckoutStripe(@Body() checkoutDto: any) {
    return this.stripeService.createSession(checkoutDto);
  }

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
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
