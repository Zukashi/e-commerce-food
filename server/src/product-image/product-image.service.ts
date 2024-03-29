import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../libs/awsClient';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import { AwsService } from '../aws/aws.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
  ) {}

  async getAllImages() {
    const productsFromDb = await this.productImageRepository.find({});
    if (!productsFromDb) throw new NotFoundException(`Products not found`);
    for (const product of productsFromDb) {
      const getObjectParams = {
        Bucket: this.configService.get<string>('BUCKET_NAME'),
        Key: product.imageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });
      product.imageUrl = url;
      await this.productImageRepository.save(product);
    }
    return productsFromDb;
  }

  async deleteOne(id: string) {
    await this.productImageRepository.delete({ id });
    void this.awsService.delete(id);
  }

  async create(file: Express.Multer.File) {
    const imageName = await this.awsService.create(file);
    try {
      const product = this.productImageRepository.create({
        imageName: imageName,
      });
      await this.productImageRepository.save(product);
      return product;
    } catch (e) {
      throw new HttpException('image with this name already exists', 409);
    }
  }
  async update(id: string, file: Express.Multer.File) {
    const { id: productId, imageName } = await this.awsService.updateImage(
      id,
      file,
    );
    const newProduct = await this.productImageRepository.preload({
      id: productId,
      imageName,
    });
    if (!newProduct) throw new NotFoundException();
    await this.productImageRepository.save(newProduct);
  }

  async createOneSignedUrl(productImage: ProductImage) {
    const getObjectParams = {
      Bucket: this.configService.get<string>('BUCKET_NAME'),
      Key: productImage.imageName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });
    productImage.imageUrl = url;
    await this.productImageRepository.save(productImage);
    return productImage;
  }
}
