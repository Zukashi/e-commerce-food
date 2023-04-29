import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
export type productCategoryTypes =
  | 'vegetables_&_fruits'
  | 'meats_&_seafood'
  | 'milks_&_dairies'
  | 'beverages';
export enum ProductCategoryEnum {
  VEGETABLES_FRUITS = 'vegetables_&_fruits',
  MEATS_SEAFOOD = 'meats_&_seafood',
  MILKS_DAIRIES = 'milks_&_dairies',
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

  @Index('product_vendorId_index')
  @ManyToOne((type) => Vendor, (vendor) => vendor.products, {
    cascade: true,
    nullable: false,
  })
  vendor: Vendor;
}
