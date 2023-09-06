import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Product } from '../product/entities/product.entity';
import JwtAuthenticationGuard from '../auth/guards/JwtAuthGuard';
import { ReqWithUser } from '../user/middleware/user.middleware';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @UseGuards(JwtAuthenticationGuard)
  @Post('')
  async createOrder(
    @Req() req: ReqWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.addOrder(req, createOrderDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order added successfully',
      data: order,
    };
  }
}
