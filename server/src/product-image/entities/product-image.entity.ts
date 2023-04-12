import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageName: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne((type) => Product, (product) => product.productImages)
  product: Product;
}
