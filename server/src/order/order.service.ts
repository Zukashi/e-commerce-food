import { Injectable } from '@nestjs/common';
import { ReqWithVendor } from '../auth/types/Req/Vendor';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReqWithUser } from '../user/middleware/user.middleware';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrdersOfVendor(req: ReqWithVendor): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: req.user,
      },
    });
  }
  generateOrderId(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async addOrder(req: ReqWithUser, createOrderDto: CreateOrderDto) {
    console.log('User:', req.user);
    console.log('Products:', createOrderDto.products);
    const order = this.orderRepository.create({
      vendor: req.user,
      orderId: this.generateOrderId(),
      products: createOrderDto.products,
    });
    return this.orderRepository.save(order);
  }
}
