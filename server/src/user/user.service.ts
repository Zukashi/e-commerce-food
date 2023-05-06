import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/signUp.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({
    value,
    field,
  }: {
    value: string | undefined;
    field: string;
  }) {
    console.log(value, field);
    const user = await this.userRepository.findOneBy({ [`${field}`]: value });
    if (!user) throw new NotFoundException();
    return user;
  }

  async createUser(signUpDto: SignUpDto) {
    const user = this.userRepository.create(signUpDto);
    await this.userRepository.save(user);
    return user;
  }
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    console.log(123);
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.userRepository.preload({
      id: userId,
      refresh_token: currentHashedRefreshToken,
    });
    if (!user) throw new NotFoundException();
    await this.userRepository.save(user);
  }

  async getById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async removeRefreshToken(userId: string) {
    const user = await this.userRepository.preload({
      id: userId,
      refresh_token: '',
    });
    if (!user) throw new NotFoundException();
    await this.userRepository.save(user);
  }
  async create(registrationData: any) {
    const user = this.userRepository.create(registrationData);
    return this.userRepository.save(user);
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    if (!user.refresh_token) {
      throw new UnauthorizedException('Not found token');
    }
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async updateUser(valueToTransform: any, userId: string) {
    const previousData = await this.userRepository.findOneBy({ id: userId });

    const user = await this.userRepository.preload({
      id: userId,
      ...previousData,
      ...valueToTransform,
    });
    if (!user) throw new NotFoundException();
    await this.userRepository.save(user);
    return user;
  }

  async isAlreadyInDB(signUpDto: SignUpDto) {
    const user = await this.userRepository.find({
      where: [
        { username: signUpDto.username },
        {
          email: signUpDto.email,
        },
      ],
    });
    if (user.length)
      throw new ConflictException(
        'User with this email or username already exists in the database',
      );
    return;
  }
}
