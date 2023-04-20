import { Injectable } from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Product) productRepository: Repository<Product>,
  ) {}
  async createProduct(createProductDto: CreateVendorProductDTO) {}
}
