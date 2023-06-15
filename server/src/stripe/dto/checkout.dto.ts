import {
  IsNumber,
  IsString,
  IsInstance,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
export class ProductWithQuantityCheckout extends Product {
  quantity: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductWithQuantityCheckout)
  items: ProductWithQuantityCheckout[];
}
