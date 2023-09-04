import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '../tokenPaylod';
import { UserService } from '../../user/user.service';
import { VendorService } from '../../vendor/vendor.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    try {
      const user = await this.userService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.userId,
      );
      return user;
    } catch (e) {
      const user = await this.vendorService.getVendorIfRefreshTokenMatches(
        refreshToken,
        payload.userId,
      );
      if (!user) throw new NotFoundException();

      return user;
    }
  }
}
