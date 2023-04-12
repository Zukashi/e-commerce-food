import { forwardRef, Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductImageModule } from '../product-image/product-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage, Product]),
    forwardRef(() => ProductImageModule),
  ],
  controllers: [AwsController],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
