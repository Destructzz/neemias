import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Record } from './entities/record.entity';

@Module({
  controllers: [RecordController],
  imports : [TypeOrmModule.forFeature([User, Record])],
  providers: [RecordService],
})
export class RecordModule {}
