import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { AwsService } from '../aws/aws.service';
import { ProductImageService } from '../product-image/product-image.service';
import { ProductService } from '../product/product.service';
import { SignInDto } from '../auth/dto/signIn.dto';
import { Vendor } from './entities/vendor.entity';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productService: ProductService,
    private readonly awsService: AwsService,
    private readonly productImageService: ProductImageService,
  ) {}
  async createProduct(
    createProductDto: CreateVendorProductDTO,
    files: Array<Express.Multer.File>,
    vendor: Vendor,
  ) {
    const product = await this.productService.create(createProductDto, vendor);
    const products = await Promise.all(
      files.map(async (file) => {
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
    return product;
  }

  async findOne({
    field,
    value,
  }: {
    field: string;
    value: string | undefined;
  }) {
    const user = await this.vendorRepository.findOneBy({ [`${field}`]: value });
    if (!user) throw new NotFoundException();
    return user;
  }

  async isAlreadyInDb(signUpDto: SignUpDto) {
    const user = await this.vendorRepository.find({
      where: [
        { username: signUpDto.username },
        {
          email: signUpDto.email,
        },
      ],
    });
    console.log(user);
    if (user.length)
      throw new ConflictException(
        'Vendor with this email or username already exists in the database',
      );
  }

  async createVendor(signUpDto: SignUpDto) {
    const user = await this.vendorRepository.create(signUpDto);
    return this.vendorRepository.save(user);
  }

  async setCurrentRefreshToken(token: string, id: string) {
    const currentHashedRefreshToken = await bcrypt.hash(token, 10);
    const user = await this.vendorRepository.preload({
      id,
      refresh_token: currentHashedRefreshToken,
    });
    if (!user) throw new NotFoundException();
    await this.vendorRepository.save(user);
  }

  async getVendorIfRefreshTokenMatches(refreshToken: any, userId: string) {
    const user = await this.findOne({ field: 'id', value: userId });
    if (!user.refresh_token) {
      throw new UnauthorizedException('Not found token');
    }
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
