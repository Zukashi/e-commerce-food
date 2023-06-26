import { Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { stripe } from '../main';
import { ProductService } from '../product/product.service';

@Injectable()
export class StripeService {
  constructor(private readonly productService: ProductService) {}
  async createSession(checkoutDto: CheckoutDto) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: await Promise.all(
          checkoutDto.items.map(async (item) => {
            const storeItem = await this.productService.findOne(item.id);
            return {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: storeItem.productName,
                },
                unit_amount: storeItem.price * 100,
              },
              quantity: storeItem.quantity,
            };
          }),
        ),
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/checkout/success`,
      });
      console.log(session.url);
      return session;
    } catch (e) {
      console.log(e);
    }
  }
}
