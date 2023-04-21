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

@Controller('product-image')
export class ProductImageController {
  constructor(
    private readonly awsService: AwsService,
    private readonly productImageService: ProductImageService,
  ) {}
  @Get('all')
  async getAll() {
    return this.productImageService.getAllImages();
  }
  @Post('one')
  @UseInterceptors(FileInterceptor('image'))
  async createOne(@UploadedFile() file: Express.Multer.File) {
    try {
      await this.productImageService.create(file);
    } catch (e) {}
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
