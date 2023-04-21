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
import { RefreshTokenGuard, ReqWithUser } from './guards/refresh-token.guards';
import { AccessTokenGuard } from './guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    return this.authService.signIn(signInDto, res);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    void this.authService.signUp(signUpDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Patch('refreshToken')
  async refreshToken(@Res() res: Response, @Req() req: ReqWithUser) {
    return this.authService.refreshToken(req.user, res);
  }
  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  async deleteCookies(@Req() req: ReqWithUser, @Res() res: Response) {
    return this.authService.logout(req.user.id, res);
  }
}
