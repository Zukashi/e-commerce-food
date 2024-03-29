import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategoryEnum } from '../../product/entities/product.entity';

export class CreateVendorProductDTO {
  @IsString()
  readonly productName: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly quantity: number;

  @IsString()
  @IsOptional()
  readonly tags?: string;
}
