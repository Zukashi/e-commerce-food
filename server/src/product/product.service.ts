import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVendorProductDTO } from '../vendor/dto/createProduct.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
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
    const oneProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: ['productImages', 'vendor'],
    });
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
    let productsFromDb;
    if (filter === 'all') {
      productsFromDb = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.productImages', 'productImages')
        .innerJoinAndSelect('product.vendor', 'vendor')
        .getMany();
      console.log(productsFromDb);
    } else {
      productsFromDb = await this.dataSource
        .getRepository(Product)
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.productImages', 'productImages')
        .innerJoinAndSelect('product.vendor', 'vendor')
        .where('product.category = :category', { category: filter })
        .getMany();
    }
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

  async getBestSellers() {
    const bestSellers = await this.productRepository.find({
      relations: ['productImages', 'vendor'],
      take: 5,
    });
    return bestSellers;
  }

  async getProductFromVendor(id: string) {
    const vendorProducts = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productImages', 'productImages.product')
      .where('product.vendorId = :vendorId', { vendorId: id })
      .getMany();
    return vendorProducts;
  }
}
