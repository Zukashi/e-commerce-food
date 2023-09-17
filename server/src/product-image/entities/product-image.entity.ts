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

  @ManyToOne(() => Product, (product) => product.productImages, {
    eager: true,
    onDelete: 'CASCADE', // automatically delete ProductImage when Product is deleted
  })
  product: Product;
}
