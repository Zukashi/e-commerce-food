import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { ProductImageService } from './product-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('product-image')
export class ProductImageController {
  constructor(
    private readonly awsService: AwsService,
    private readonly productImageService: ProductImageService,
  ) {}
  @UseGuards(AccessTokenGuard)
  @Get('all')
  async getAll() {
    return this.productImageService.getAllImages();
  }
  @Post('one')
  @UseInterceptors(FileInterceptor('image'))
  async createOne(@UploadedFile() file: Express.Multer.File) {
    await this.productImageService.create(file);
  }
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.productImageService.deleteOne(id);
  }
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateOne(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    void this.awsService.updateImage(id, file);
  }
}
