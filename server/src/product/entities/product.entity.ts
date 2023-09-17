import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
export type productCategoryTypes =
  | 'vegetables & fruits'
  | 'meats & seafood'
  | 'milks & dairies'
  | 'beverages';
export enum ProductCategoryEnum {
  VEGETABLES_FRUITS = 'vegetables & fruits',
  MEATS_SEAFOOD = 'meats & seafood',
  MILKS_DAIRIES = 'milks & dairies',
  BEVERAGES = 'beverages',
}
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  productName: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: ProductCategoryEnum,
  })
  category: productCategoryTypes;

  @Column()
  quantity: number;

  @OneToMany((type) => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  productImages: ProductImage[];

  @ManyToOne((type) => Vendor, (vendor) => vendor.products, {
    cascade: true,
    nullable: false,
  })
  vendor: Vendor;
}
