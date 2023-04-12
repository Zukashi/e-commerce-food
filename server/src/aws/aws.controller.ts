import { Controller, Post } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private awsService: AwsService) {}
  @Post('')
  create() {
    void this.awsService.create();
  }
}
