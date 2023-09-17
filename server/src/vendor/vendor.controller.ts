import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { VendorService } from './vendor.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from '../auth/guards/JwtAuthGuard';
import { ReqWithVendor } from '../auth/types/Req/Vendor';
const sharp = require('sharp');

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}
  @UseGuards(JwtAuthenticationGuard)
  @Post('product')
  @UseInterceptors(FilesInterceptor('image'))
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: ReqWithVendor,
    @Body('product') createProductDto: string,
  ) {
    // parse createProductDto because it's in JSON currently
    const product = JSON.parse(createProductDto);
    console.log(product);
    return await this.vendorService.createProduct(product, files, req.user);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get('products')
  async getProduct(@Req() req: ReqWithVendor) {
    return await this.vendorService.getVendorProducts(req);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('orders')
  async getOrders(@Req() req: ReqWithVendor) {
    console.log(req, 999);
    return await this.vendorService.getVendorOrders(req);
  }
}
