import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UserMiddleware } from '../user/middleware/user.middleware';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart';
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => VendorModule),
    TypeOrmModule.forFeature([Cart, Vendor, User, Product]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('cart');
  }
}
