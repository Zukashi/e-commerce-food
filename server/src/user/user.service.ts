import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/signUp.dto';
import { AuthService } from '../auth/auth.service';

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
    console.log(value, field, 555);
    const user = await this.userRepository.findOneBy({ [`${field}`]: value });
    return user;
  }

  async createUser(signUpDto: SignUpDto) {
    const user = this.userRepository.create(signUpDto);
    console.log(user);
    await this.userRepository.save(user);
    return user;
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
