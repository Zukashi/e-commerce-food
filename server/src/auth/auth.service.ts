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
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorService } from '../vendor/vendor.service';
const Joi = require('joi');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private readonly vendorService: VendorService,
  ) {}

  async signIn(signInDto: SignInDto, role: string, res: Response) {
    console.log(signInDto);
    if (!(signInDto.username || signInDto.email)) {
      throw new UnauthorizedException();
    }

    const findBy = signInDto.username
      ? { value: signInDto.username, field: 'username' }
      : { value: signInDto.email, field: 'email' };

    let user;
    if (role === 'customer') {
      user = await this.userService.findOne(findBy);
    } else if (role === 'vendor') {
      user = await this.vendorService.findOne(findBy);
    }
    if (!user) throw new NotFoundException();
    const isCorrect = await bcrypt.compare(signInDto.password, user.password);
    if (!isCorrect) return new BadRequestException();
    const accessToken = jwt.sign(
      { id: user.id, role: role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      },
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      },
    );
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
      if (signUpDto.role === 'customer') {
        await this.userService.isAlreadyInDB(signUpDto);
      } else if (signUpDto.role === 'vendor') {
        await this.vendorService.isAlreadyInDb(signUpDto);
      }
      // Hash password

      const hash = await bcrypt.hash(signUpDto.password, 10);
      if (signUpDto.role === 'customer') {
        await this.userService.createUser({
          ...signUpDto,
          password: hash,
        });
      } else if (signUpDto.role === 'vendor') {
        await this.vendorService.createVendor({
          ...signUpDto,
          password: hash,
        });
      }
    }
  }

  async refreshToken(user: User, res: Response) {
    console.log(user);
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      },
    );
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
