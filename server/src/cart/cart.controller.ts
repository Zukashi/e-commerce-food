import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ReqWithCustomer } from '../auth/types/Req/User';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/AddItem.dto';
import { Response } from 'express';
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
    @Res({ passthrough: true }) res: Response,
    @Body() addItemDto: AddItemDto,
    @Param('productId') productId: string,
  ) {
    return this.cartService.addItemToCartOrUpdateQuantity(
      req,
      addItemDto,
      productId,
      res,
    );
  }
  @Delete('/product/:productId')
  async deleteItemFromCart(
    @Req() req: ReqWithCustomer,
    @Param('productId') productId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.cartService.deleteItemFromCart(req, productId, res);
  }
}
