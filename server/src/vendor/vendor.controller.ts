import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { VendorService } from './vendor.service';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}
  @Post('product')
  @UseInterceptors(FilesInterceptor('image'))
  async createProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('product') createProductDto: string,
  ) {
    const product = JSON.parse(createProductDto) as CreateVendorProductDTO;
    console.log(files);
    console.log(product);
    const form = new FormData();
  }
}
