import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { TokenPayload } from './tokenPaylod';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly vendorService: VendorService,
  ) {}

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
  public getCookieWithJwtAccessToken(userId: string) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }
  public async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.findOne({
        value: email,
        field: 'email',
      });
      const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password as string,
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async register(registrationData: SignUpDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      if (registrationData.role === 'customer') {
        await this.userService.isAlreadyInDB(registrationData);
        const createdUser = await this.userService.create({
          ...registrationData,
          password: hashedPassword,
        });
        return createdUser;
      } else if (registrationData.role === 'vendor') {
        await this.vendorService.isAlreadyInDB(registrationData);
        const createdVendor = await this.vendorService.createVendor({
          ...registrationData,
          password: hashedPassword,
        });
        return createdVendor;
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: any = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  // ...
}
