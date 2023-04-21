import {
  Body,
  Controller,
  Post,
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
    @Body('product') createProductDto: string,
  ) {
    // parse createProductDto because it's in JSON currently
    const product = JSON.parse(createProductDto);
    await this.vendorService.createProduct(product, files);
  }
}
