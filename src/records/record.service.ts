import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async getRecord(user: User) {
    return await this.recordRepository.find({
      where: { user: { id: user.id } },
      
    });
  }

  async createRecord(user: User, createRecordDto: CreateRecordDto) {
    const newRecord = this.recordRepository.create({
      date: new Date(createRecordDto.date),
      user: user,
      doctor: { id: createRecordDto.doctorId }, // Устанавливаем врача по ID
    });

    await this.recordRepository.save(newRecord);
    return { message: 'Record successfully created', newRecord };
  }

  async deleteRecord(id: number) {
    const record = await this.recordRepository.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    await this.recordRepository.delete(id);
    return { message: 'Record successfully deleted' };
  }
}
