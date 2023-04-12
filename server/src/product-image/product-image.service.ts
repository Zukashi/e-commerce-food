import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../product/entities/product.entity';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../libs/awsClient';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async getAllImages() {
    const productsFromDb = await this.productImageRepository.find({});
    if (!productsFromDb) throw new NotFoundException(`Products not found`);
    for (const product of productsFromDb) {
      const getObjectParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: product.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });
      console.log(url);
      product.imageUrl = url;
    }
    return productsFromDb;
  }

  async deleteOne(id: string) {
    await this.productImageRepository.delete({ id });
  }
}
