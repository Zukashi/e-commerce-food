import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { VendorService } from './vendor.service';
import { FilesInterceptor } from '@nestjs/platform-express';
const sharp = require('sharp');

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}
  @Post('product')
  @UseInterceptors(FilesInterceptor('image'))
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
    @Body('product') createProductDto: string,
  ) {
    console.log(req.user);
    // parse createProductDto because it's in JSON currently
    const product = JSON.parse(createProductDto);
    return await this.vendorService.createProduct(product, files);
  }
}
