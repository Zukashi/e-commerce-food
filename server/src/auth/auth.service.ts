import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
const jwt = require('jsonwebtoken');
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
const Joi = require('joi');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  async signIn(signInDto: SignInDto, res: Response) {
    if (!(signInDto.username || signInDto.email)) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(
      signInDto.username
        ? { value: signInDto.username, field: 'username' }
        : { value: signInDto.email, field: 'email' },
    );
    if (!user) throw new NotFoundException();
    const isCorrect = await bcrypt.compare(signInDto.password, user.password);
    if (!isCorrect) return new BadRequestException();
    const accessToken = jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
      { ...user },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      },
    );
    console.log(refreshToken);
    // Update refreshToken of user in database
    user.refresh_token = refreshToken;
    await this.userRepository.save(user);
    const accessCookieExpiryDate = new Date(Date.now() + 60 * 15 * 1000);
    const refreshCookieExpiryDate = new Date(
      Date.now() + 60 * 60 * 1000 * 24 * 7,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: accessCookieExpiryDate,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: refreshCookieExpiryDate,
    });
    res.json({ user, accessToken });
  }

  async signUp(signUpDto: SignUpDto) {
    if (signUpDto.confirm_password === signUpDto.password) {
      // checks if user is already in database by username / email
      await this.userService.isAlreadyInDB(signUpDto);

      // Hash password

      const hash = await bcrypt.hash(signUpDto.password, 10);
      await this.userService.createUser({
        ...signUpDto,
        password: hash,
      });
    }
  }

  async refreshToken(userId: string, res: Response) {
    const user = await this.userService.findOne({ value: userId, field: 'id' });

    const accessToken = jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const accessCookieExpiryDate = new Date(Date.now() + 60 * 15 * 1000);
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: accessCookieExpiryDate,
      })
      .status(201)
      .json({ user: user, token: accessToken });
  }

  async logout(userId: string, res: Response) {
    await this.userService.updateUser({ refresh_token: null }, userId);
    res
      .clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .sendStatus(200);
  }
}
