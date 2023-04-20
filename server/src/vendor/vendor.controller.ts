import { Body, Controller, Post } from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}
  @Post('product')
  async createProduct(@Body() createProductDto: CreateVendorProductDTO) {
    await this.vendorService.createProduct(createProductDto);
  }
}
