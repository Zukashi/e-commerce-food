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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'postgres',
      entities: [Product, Vendor, ProductImage],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductModule,
    AwsModule,
    ProductImageModule,
    AuthModule,
    UserModule,
    VendorModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
