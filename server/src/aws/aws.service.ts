import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../libs/awsClient';

import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductImageService } from '../product-image/product-image.service';
import {ConfigService} from "@nestjs/config";
const sharp = require('sharp');

@Injectable()
export class AwsService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private configService: ConfigService
  ) {}

  randomImageName = () => uuid();
  async create(file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize(1920, 1080, {
        fit: 'contain',
      })
      .toBuffer();

    const imageName = this.randomImageName();
    const params = {
      Bucket: this.configService.get<string>('BUCKET_NAME'),
      Key: imageName,
      Body: buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return imageName;
  }

  async delete(id: string) {
    const product = await this.productImageRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    const params = {
      Bucket: this.configService.get<string>('BUCKET_NAME'),
      Key: product.imageName,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const product = await this.productImageRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    const buffer = await sharp(file.buffer)
      .resize(1920, 1080, {
        fit: 'contain',
      })
      .toBuffer();
    const params = {
      Bucket: this.configService.get<string>('BUCKET_NAME'),
      Key: product.imageName,
      Body: buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return product;
  }
}
