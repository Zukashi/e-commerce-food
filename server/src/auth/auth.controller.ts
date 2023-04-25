import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthenticationService } from './auth.service';
import { UserService } from '../user/user.service';
import JwtRefreshGuard from './guards/jwtRefreshGuard';
import JwtAuthenticationGuard from './guards/JwtAuthGuard';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UserService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: Request & { user: any }) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request?.res?.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  @HttpCode(200)
  @Post('log-in')
  async logIn(
    @Body() body: { username: string; password: string },
    @Req() request: Request,
  ) {
    const user = await this.usersService.findOne({
      value: body.username,
      field: 'username',
    });

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    request?.res?.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return user;
  }

  @Post('register')
  async register(@Body() registrationData: any) {
    return this.authenticationService.register(registrationData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: Request & { user: any }) {
    await this.usersService.removeRefreshToken(request.user.id);
    request?.res?.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }
}
