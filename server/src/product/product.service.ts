import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findOne(id: string) {
    const oneProduct = await this.productRepository.findOneBy({ id });
    if (!oneProduct) throw new NotFoundException(`Product ${id} not found`);
    return oneProduct;
  }
}
