import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserMiddleware } from '../user/middleware/user.middleware';
import { UserController } from '../user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude('auth/(login|register)')
      .forRoutes(AuthController);
  }
}
