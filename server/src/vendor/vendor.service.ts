import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { AwsService } from '../aws/aws.service';
import { ProductImageService } from '../product-image/product-image.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Product) productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productService: ProductService,
    private readonly awsService: AwsService,
    private readonly productImageService: ProductImageService,
  ) {}
  async createProduct(
    createProductDto: CreateVendorProductDTO,
    files: Array<Express.Multer.File>,
  ) {
    const product = await this.productService.create(createProductDto);
    const products = await Promise.all(
      files.map(async (file) => {
        console.log(file.buffer);
        return this.productImageService.create(file);
      }),
    );
    products.forEach(async (productImage) => {
      const newProduct = await this.productImageRepository.preload({
        ...productImage,
        product: product,
      });
      if (!newProduct) throw new NotFoundException();
      await this.productImageRepository.save(newProduct);
    }, Error());
  }
}
