import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AwsModule } from '../aws/aws.module';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductImageModule } from '../product-image/product-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    ProductImageModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
