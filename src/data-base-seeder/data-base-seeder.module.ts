import { Module } from '@nestjs/common';
import { DataBaseSeederService } from './data-base-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';
import { PassportModule } from '@nestjs/passport';
import { PasswordModule } from 'src/password/password.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([User, Role]),
    PasswordModule,
  ],
  providers: [DataBaseSeederService]
})
export class DataBaseSeederModule {}
