import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.access_token_secret,
    });
  }

  async validate(payload: string) {
    const user = await this.userService.findOne({
      value: payload,
      field: 'username',
    });
    return user;
  }
}
