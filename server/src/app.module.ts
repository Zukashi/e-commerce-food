import { forwardRef, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { AwsModule } from './aws/aws.module';
import { ProductImageModule } from './product-image/product-image.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';
import { Vendor } from './vendor/entities/vendor.entity';
import { ProductImage } from './product-image/entities/product-image.entity';
import { APP_PIPE } from '@nestjs/core';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';
import { JwtRefreshTokenStrategy } from './auth/strategy/jwt-refresh-token-strategy';
import { JwtStrategy } from './auth/strategy/jwt-strategy';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailSchedulingModule } from './email-scheduling/email-scheduling.module';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'postgres',
      entities: [Product, Vendor, ProductImage, User, Cart],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    ProductModule,
    AwsModule,
    ProductImageModule,
    AuthModule,
    UserModule,
    VendorModule,
    PassportModule,
    EmailModule,
    EmailSchedulingModule,
    CartModule,
    StripeModule,
    OrderModule,
  ],
  providers: [
    LocalStrategy,
    JwtRefreshTokenStrategy,
    JwtStrategy,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
