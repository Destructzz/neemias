import { 
  Controller, UnauthorizedException, Body, Param, Post, Delete 
} from '@nestjs/common';
import { RecordService } from './record.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/users/interface/user.interface';
import { Get, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';

@Controller('api/record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getRecord(@Req() req: AuthenticatedRequest) {
    const user = await this.userRepository.findOne({ where: { id: req.user.id } });

    if (!user) {
      throw new UnauthorizedException('User from cookie doesn\'t exist');
    }
    return this.recordService.getRecord(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRecord(
    @Req() req: AuthenticatedRequest, 
    @Body() createRecordDto: CreateRecordDto
  ) {
    const user = await this.userRepository.findOne({ where: { id: req.user.id } });

    if (!user) {
      throw new UnauthorizedException('User from cookie doesn\'t exist');
    }

    return this.recordService.createRecord(user, createRecordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteRecord(
    @Req() req: AuthenticatedRequest, 
    @Param('id') id: number
  ) {
    const user = await this.userRepository.findOne({ where: { id: req.user.id } });

    if (!user) {
      throw new UnauthorizedException('User from cookie doesn\'t exist');
    }

    return this.recordService.deleteRecord(id);
  }
}
