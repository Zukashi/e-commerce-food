import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from './cart.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    cascade: ['insert', 'update'],
  })
  cart: Cart;
  @OneToOne(() => Product, (product) => product.cartItem, {
    cascade: true,
  })
  @JoinColumn()
  product: Product;

  @Column({
    type: 'integer',
    default: 0,
  })
  quantity: number;
}
