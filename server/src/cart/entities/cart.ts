import {
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
