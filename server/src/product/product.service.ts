import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateVendorProductDTO } from '../vendor/dto/createProduct.dto';

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

  async create(createProductDto: CreateVendorProductDTO) {
    const product = await this.productRepository.create({
      ...createProductDto,
      price: Number(createProductDto.price),
      quantity: Number(createProductDto.quantity),
    });
    await this.productRepository.save(product);
    return product;
  }
}
