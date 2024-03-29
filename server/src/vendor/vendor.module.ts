import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { AwsModule } from '../aws/aws.module';
import { ProductImageModule } from '../product-image/product-image.module';
import { ProductModule } from '../product/product.module';
import { Vendor } from './entities/vendor.entity';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Vendor]),
    AwsModule,
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    ProductImageModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
