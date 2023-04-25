import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { Field } from 'mysql2';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  quantity: number;

  @OneToMany((type) => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  productImages: ProductImage[];

  @ManyToOne((type) => Vendor, (vendor) => vendor.product, {
    cascade: true,
    nullable: false,
  })
  vendor: Vendor;
}
