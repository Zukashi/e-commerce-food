import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('best')
  async getBestSellers() {
    return this.productService.getBestSellers();
  }

  @Get('all')
  async getSpecifiedCategory(@Query('filter') filter: string) {
    return this.productService.getFilteredByOneCategory(filter);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
