import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@Request() req: any) {}
}
