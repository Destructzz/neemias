import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordModule } from 'src/password/password.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Doctor } from './entities/doctor.entity';
import { Role } from './entities/role.entity';
import { Specialty } from './entities/specialty.entity';
import { Record } from 'src/records/entities/record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Doctor, Role, Specialty, Record]), // Регистрация репозитория
    AuthModule,
    PasswordModule,          // Импортируем модуль с PasswordService
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
