import { Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import { stripe } from '../main';
import { ProductService } from '../product/product.service';
import { CartService } from '../cart/cart.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  constructor(
    private configService: ConfigService,
    private readonly productService: ProductService,
  ) {}
  async createSession(checkoutDto: CheckoutDto) {
    console.log(checkoutDto);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        line_items: await Promise.all(
          checkoutDto.items.map(async (item) => {
            const storeItem = await this.productService.findOne(item.id);
            console.log(storeItem);
            return {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: storeItem.productName,
                  images: [storeItem.productImages[0].imageUrl],
                },
                unit_amount: item.price * 100,
              },
              quantity: item.quantity,
            };
          }),
        ),
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}`,
      });

      return session;
    } catch (e) {
      console.log(e);
    }
  }

  public async constructEventFromPayload(signature: string, payload: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
