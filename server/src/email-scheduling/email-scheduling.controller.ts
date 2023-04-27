import { Body, Controller, Post } from '@nestjs/common';
import { EmailSchedulingService } from './email-scheduling.service';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}
  @Post('newsletter')
  scheduleEmail(@Body() { email }: { email: string }) {
    this.emailSchedulingService.scheduleEmail(email);
  }
}
