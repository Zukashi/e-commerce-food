import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ReqWithCustomer } from '../auth/types/Req/User';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/AddItem.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  async getCartItems(@Req() req: ReqWithCustomer) {
    return this.cartService.getItems(req);
  }

  @Post('/product/:productId')
  async addItemToCart(
    @Req() req: ReqWithCustomer,
    @Body() addItemDto: AddItemDto,
    @Param('productId') productId: string,
  ) {
    return this.cartService.addItemToCart(req, addItemDto, productId);
  }
  @Delete('/product/:productId')
  async deleteItemFromCart(
    @Req() req: ReqWithCustomer,
    @Param('productId') productId: string,
  ) {
    await this.cartService.deleteItemFromCart(req, productId);
  }
}
