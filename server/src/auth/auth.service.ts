import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
const Joi = require('joi');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    if (!(signInDto.username || signInDto.email)) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(
      signInDto.username
        ? { value: signInDto.username, field: 'username' }
        : { value: signInDto.email, field: 'email' },
    );
    if (!user) throw new NotFoundException();
    const isCorrect = await argon2.verify(user.password, signInDto.password);
    if (!isCorrect) return new BadRequestException();
    const tokens = await this.getTokens(user.id, user.username);
    const refresh = await this.hashData(tokens.refreshToken);
    await this.updateRefreshToken(user.id, refresh);
    // Update refreshToken of user in database

    return {
      ...tokens,
      refreshToken: refresh,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    if (signUpDto.confirm_password === signUpDto.password) {
      // checks if user is already in database by username / email
      await this.userService.isAlreadyInDB(signUpDto);

      // Hash password

      const hash = await this.hashData(signUpDto.password);
      const createUserDto = {
        ...signUpDto,
        password: hash,
      };
      // creates new user
      const newUser = await this.userService.createUser(createUserDto);
      const tokens = await this.getTokens(newUser.id, newUser.username);
      const refresh = await this.hashData(tokens.refreshToken);
      await this.updateRefreshToken(newUser.id, refresh);
      return {
        ...tokens,
        refresh_token: refresh,
      };
    }
    throw new BadRequestException();
  }

  async refreshToken(userId: string, refreshToken: string, res) {
    const user = await this.userService.findOne({ value: userId, field: 'id' });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied');
    }
    console.log(user.refresh_token);
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    console.log(refreshTokenMatches);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    const refresh = await this.hashData(tokens.refreshToken);
    await this.updateRefreshToken(user.id, refresh);

    return {
      ...tokens,
      refresh_token: refresh,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne({ value: userId, field: 'id' });
    if (!user) return new NotFoundException();
    await this.userService.updateUser({ refresh_token: refreshToken }, user.id);
    return;
  }

  async hashData(data: string) {
    return argon2.hash(data);
  }
  async logout(userId: string) {
    return await this.userService.updateUser({ refresh_token: null }, userId);
  }
  async getTokens(userId: string, username: string) {
    const user = await this.userService.findOne({ value: userId, field: 'id' });
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...user },
        {
          secret: jwtConstants.access_token_secret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { ...user },
        {
          secret: jwtConstants.refresh_token_secret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
