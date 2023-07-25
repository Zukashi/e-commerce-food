import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [ProductModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
