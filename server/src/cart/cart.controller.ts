import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import Request from 'express';
import { ReqWithCustomer } from '../auth/types/Req/User';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/AddItem.dto';
import { Response } from 'express';
import { ChangeItemDto } from './dto/ChangeItem.dto';
import { ReqWithVendor } from '../auth/types/Req/Vendor';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Delete('/')
  async deleteCartItems(
    @Req() req: ReqWithCustomer,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.cartService.deleteCart(res);
  }
  @Get('/')
  async getCartItems(@Req() req: ReqWithCustomer) {
    const cart = await this.cartService.getItems(req);
    return cart;
  }
  @Patch('/product/:productId/quantity')
  async changeQuantityOfProductInCart(
    @Req() req: ReqWithCustomer,
    @Body() changeItemDto: ChangeItemDto,
    @Param('productId') productId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.cartService.changeItemQuantityInCart(
      req,
      changeItemDto,
      productId,
      res,
    );
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

  @Patch('/product/:productId')
  async removeElementFromCart(
    @Req() req: ReqWithCustomer,
    @Param('productId') productId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.cartService.removeElementFromCart(req, productId, res);
  }
}
