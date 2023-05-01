import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;
  @OneToOne(() => Product, {
    eager: true,
  })
  @JoinColumn()
  product: Product;

  @Column({
    type: 'integer',
    default: 1,
  })
  quantity: number;
}
