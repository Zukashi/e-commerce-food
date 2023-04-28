import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageName: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Index('product-image_productId_index')
  @ManyToOne((type) => Product, (product) => product.productImages, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
