import {
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    eager: true,
    cascade: true,
  })
  products: CartItem[];
}
