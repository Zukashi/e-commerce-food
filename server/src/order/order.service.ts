import { Injectable } from '@nestjs/common';
import { ReqWithVendor } from '../auth/types/Req/Vendor';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrdersOfVendor(req: ReqWithVendor) {
    return this.orderRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: req.user,
      },
    });
  }
}
