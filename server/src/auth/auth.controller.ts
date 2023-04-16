import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Public } from './decorator/public.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { Cookies } from './decorator/cookie.decorator';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guards';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    void this.authService.signUp(signUpDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Patch('refreshToken')
  async refreshToken(@Req() req: Request) {
    const userId = (req.user as any).sub.id;
    console.log(555);
    const refreshToken = (req.user as any)['refresh_token'];
    return this.authService.refreshToken(userId, refreshToken);
  }
  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  async deleteCookies(@Req() req: Request) {
    return this.authService.logout((req.user as User).id);
  }
}
