import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('all')
  async getSpecifiedCategory(@Query('filter') filter: any) {
    console.log(filter);
    return this.productService.getFilteredByOneCategory(filter);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
