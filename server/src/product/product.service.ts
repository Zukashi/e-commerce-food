import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVendorProductDTO } from '../vendor/dto/createProduct.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../libs/awsClient';
import { ProductImageService } from '../product-image/product-image.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private productImageService: ProductImageService,
    private configService: ConfigService,
  ) {}

  async findOne(id: string) {
    const oneProduct = await this.productRepository.findOneBy({ id });
    if (!oneProduct) throw new NotFoundException(`Product ${id} not found`);
    return oneProduct;
  }

  async create(createProductDto: CreateVendorProductDTO, vendor: Vendor) {
    const product = await this.productRepository.create({
      ...createProductDto,
      price: Number(createProductDto.price),
      quantity: Number(createProductDto.quantity),
      vendor,
    });
    await this.productRepository.save(product);
    return product;
  }

  async getFilteredByOneCategory(filter: string) {
    const productsFromDb = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productImages', 'productImages')
      .where('product.category = :category', { category: filter })
      .getMany();
    for (const product of productsFromDb) {
      const productImagesSigned = await Promise.all(
        product.productImages.map(async (productImage) => {
          return this.productImageService.createOneSignedUrl(productImage);
        }),
      );
      product.productImages = productImagesSigned;
      await this.productRepository.save(product);
    }
    return productsFromDb;
  }
}
