import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { jwtConstants } from '../constants';
import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.refresh_token_secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log(333);
    const user = await this.userService.findOne({
      value: payload,
      field: 'username',
    });
    const refresh_token = req
      .get('Authorization')
      ?.replace('Bearer', '')
      .trim();
    return { sub: { ...user }, refresh_token };
  }
}
