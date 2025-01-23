import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User, Role])],
  controllers: [PageController]
})
export class PageModule {}
