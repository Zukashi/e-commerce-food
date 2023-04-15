import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorator/public.decorator';

@Controller('user')
export class UserController {
  @Public()
  @Get('profile')
  getProfile(@Request() req: any) {
    console.log(req.oidc.isAuthenticated());
  }
}
