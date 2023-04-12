import { Controller, Get, Post } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private awsService: AwsService) {}
  @Get()
  get() {
    console.log('test123');
  }
  @Post('')
  create() {
    console.log('test');
  }
}
