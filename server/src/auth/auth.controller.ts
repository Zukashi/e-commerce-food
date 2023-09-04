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
import { VendorService } from '../vendor/vendor.service';
import { Vendor } from '../vendor/entities/vendor.entity';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UserService,
    private vendorService: VendorService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: Request & { user: User | Vendor }) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(request.user.id);

    request?.res?.setHeader('Set-Cookie', accessTokenCookie);
    // return role customer if user is customer or vendor if user is vendor
    if (request.user instanceof Vendor) {
      return {
        ...request.user,
        role: 'vendor',
      };
    } else {
      return {
        ...request.user,
        role: 'customer',
      };
    }
  }
  @HttpCode(200)
  @Post('log-in/customer')
  async logInCustomer(
    @Body() body: { email: string; password: string; username: string },
    @Req() request: Request,
  ) {
    let user = await this.usersService.findOne({
      value: body.username,
      field: 'username',
    });
    if (user.username !== body.username) {
      user = await this.usersService.findOne({
        value: body.email,
        field: 'email',
      });
    }

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
    return {
      ...user,
      role: 'customer',
    };
  }
  @HttpCode(200)
  @Post('log-in/vendor')
  async logInVendor(
    @Body() body: { email: string; password: string; username: string },
    @Req() request: Request,
  ) {
    console.log(123);
    let user = await this.vendorService.findOne({
      value: body.username,
      field: 'username',
    });

    if (user.username !== body.username) {
      user = await this.vendorService.findOne({
        value: body.email,
        field: 'email',
      });
    }

    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.vendorService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    console.log(user);
    request?.res?.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return {
      ...user,
      role: 'vendor',
    };
  }
  @Post('register')
  async register(@Body() registrationData: SignUpDto) {
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
