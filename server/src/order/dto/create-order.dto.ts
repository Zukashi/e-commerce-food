import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';
export class ProductWithQuantityCheckout extends Product {
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @Type(() => Product)
  products: Product[];
}
