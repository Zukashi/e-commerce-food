import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';

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

  @OneToMany((type) => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];
}
