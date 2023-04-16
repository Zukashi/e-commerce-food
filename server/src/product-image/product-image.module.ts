import { forwardRef, Module } from '@nestjs/common';
import { ProductImage } from './entities/product-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { AwsModule } from '../aws/aws.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
// import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    forwardRef(() => AwsModule),
  ],
  providers: [ProductImageService],
  controllers: [ProductImageController],
  exports: [ProductImageService],
})
export class ProductImageModule {}
