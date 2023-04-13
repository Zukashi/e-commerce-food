import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { jwtConstants } from './constants';
const Joi = require('joi');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto, res: Response): Promise<any> {
    const schema = Joi.alternatives().try(
      Joi.object().keys({
        password: Joi.string().required().max(20),
        username: Joi.string().max(20),
      }),
      Joi.object().keys({
        password: Joi.string().required().max(20),
        email: Joi.string().email(),
      }),
    );
    if (!schema.validate(signInDto)) throw new UnauthorizedException();

    if (!(signInDto.username && signInDto.email)) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(
      signInDto.username
        ? { value: signInDto.username, field: 'username' }
        : { value: signInDto.email, field: 'email' },
    );
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user.id };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.access_token_secret,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refresh_token_secret,
    });
    res.cookie('access_token', access_token, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });
    res.cookie('refresh_token', refresh_token, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
      sameSite: 'strict',
      httpOnly: true,
    });
    // Update refreshToken of user in database
    const updatedUser = await this.userService.updateUser(
      { refresh_token: refresh_token },
      user,
    );

    res.json(updatedUser);
  }

  async signUp(signUpDto: SignUpDto) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      username: Joi.string().max(20).required(),
      password: Joi.string().required().max(20).required(),
    });
    if (!schema.validate(signUpDto)) throw new UnauthorizedException();
    const user = await this.userService.createUser(signUpDto);
    return `${user.username} has been created`;
  }

  async refreshToken(refresh_token: string, res: Response) {
    const user = await this.userService.findOne({
      field: 'refresh_token',
      value: refresh_token,
    });

    if (!user) throw new UnauthorizedException();
    const payload = { username: user.username, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.access_token_secret,
    });
    console.log(access_token);
    res
      .cookie('access_token', access_token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'strict',
        httpOnly: true,
      })
      .end();
  }
}
