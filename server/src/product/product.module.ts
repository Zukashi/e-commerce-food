import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductImageModule } from '../product-image/product-image.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, User]),
    ProductImageModule,
    UserModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
