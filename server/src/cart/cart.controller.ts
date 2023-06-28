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
import { ReqWithCustomer } from '../auth/types/Req/User';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/AddItem.dto';
import { Response } from 'express';
import { ChangeItemDto } from './dto/ChangeItem.dto';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  async getCartItems(@Req() req: ReqWithCustomer) {
    return this.cartService.getItems(req);
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
