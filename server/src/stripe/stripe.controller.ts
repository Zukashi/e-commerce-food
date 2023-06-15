import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('checkout/session')
  async redirectToCheckoutStripe(@Body() checkoutDto: CheckoutDto) {
    return this.stripeService.createSession(checkoutDto);
  }
}
