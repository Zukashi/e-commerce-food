import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/signUp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ field, value }: { field: string; value: string }) {
    return this.userRepository.findOneBy({ [`${field}`]: value });
  }

  async createUser(signUpDto: SignUpDto) {
    const user = this.userRepository.create(signUpDto);
    await this.userRepository.save(user);
    return user;
  }

  async updateUser(valueToTransform: any, previousData: User) {
    const user = await this.userRepository.preload({
      ...previousData,
      ...valueToTransform,
    });
    if (!user) throw new NotFoundException();
    await this.userRepository.save(user);
    return user;
  }
}
