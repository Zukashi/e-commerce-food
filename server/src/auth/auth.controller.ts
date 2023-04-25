import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
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
  @Post('login/:role')
  async signIn(
    @Param('role') role: string,
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ) {
    console.log('test', role);
    return this.authService.signIn(signInDto, role, res);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Patch('refreshToken')
  async refreshToken(@Res() res: Response, @Req() req: ReqWithUser) {
    console.log((req as any).user, 555);
    await this.authService.refreshToken(req.user, res);
  }
  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  async deleteCookies(@Req() req: ReqWithUser, @Res() res: Response) {
    return this.authService.logout(req.user.id, res);
  }
}
