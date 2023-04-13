import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';

@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@Request() req: any) {
    return 123;
  }
}
