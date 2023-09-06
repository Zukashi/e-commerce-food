import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import {
  Product,
  ProductCategoryEnum,
} from '../../product/entities/product.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  user: User;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders, { nullable: true })
  vendor: Vendor;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
