import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVendorProductDTO } from './dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from '../product-image/entities/product-image.entity';
import { ProductImageService } from '../product-image/product-image.service';
import { ProductService } from '../product/product.service';
import { Vendor } from './entities/vendor.entity';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { ReqWithVendor } from '../auth/types/Req/Vendor';
import { OrderService } from '../order/order.service';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Product)
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly orderService: OrderService,
  ) {}
  async createProduct(
    createProductDto: CreateVendorProductDTO,
    files: Array<Express.Multer.File>,
    vendor: Vendor,
  ) {
    try {
      // Create product
      const product = await this.productService.create(
        createProductDto,
        vendor,
      );

      // Create product images
      const productImages = await Promise.all(
        files.map((file) => this.productImageService.create(file)),
      );
      console.log(product, productImages);
      // Link product images to the product
      await Promise.all(
        productImages.map(async (productImage) => {
          await this.productImageService.createOneSignedUrl(productImage);
          productImage.product = product;
          console.log(productImage);
          const newProductImage = await this.productImageRepository.save(
            productImage,
          );
          // @TODO productid in productimage isnt saved and INSERT INTO product inserts default values?
          return productImage;
        }),
      );

      // Refetch the product from the database to get the most updated version
      const updatedProduct = await this.productService.findOne(product.id);

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status || 500);
    }
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

  async isAlreadyInDB(signUpDto: SignUpDto) {
    const user = await this.vendorRepository.find({
      where: [
        { username: signUpDto.username },
        {
          email: signUpDto.email,
        },
      ],
    });
    if (user.length)
      throw new ConflictException(
        'Vendor with this email or username already exists in the database',
      );
  }

  async createVendor(signUpDto: SignUpDto) {
    const user = this.vendorRepository.create(signUpDto);
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

  async getVendorIfRefreshTokenMatches(refreshToken: string, userId: string) {
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

  async getVendorProducts(req: ReqWithVendor) {
    return this.productService.getProductFromVendor(req.user.id);
  }

  async getVendorOrders(req: ReqWithVendor) {
    return this.orderService.getOrdersOfVendor(req);
  }
}
