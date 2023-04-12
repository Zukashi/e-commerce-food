import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from '../../product-image/entities/product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @OneToMany((type) => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];
}
