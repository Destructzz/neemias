import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Delete,
  Get,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './interface/user.interface';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Response } from 'express';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  @Post('user/register')
  async register(@Body() body: CreateUserDto) {
    this.usersService.register(body.username, body.password);
    return {message : 'User Successfuly registered'}
  }

  @Post('user/login') //localhost:8080/api/user/login POST
  async login(@Body() body: CreateUserDto, @Res() res: Response) {
    await this.usersService.login(body.username, body.password, res);

    res.write(JSON.stringify({message : 'Login successful'}))
    res.end()
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/check')
  async check(@Req() req: AuthenticatedRequest) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });
    return { username: user.username };
  }
  
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      path: '/', // Рекомендуется, если был задан при установке
    });

    res.write(JSON.stringify({ message: 'Logout successful' }));
    res.end()
  }

  @Get('doctor')
  async getDoctor() {
    return this.usersService.getDoctor();
  }

  @Get('specialty')
  async getSpecialty() {
    return this.usersService.getSpecialty();
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('specialty')
  async specialtyCreate(
    @Req() req: AuthenticatedRequest,
    @Body() Body: CreateSpecialtyDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (
      !(await this.roleRepository.findOne({ where: { name: 'administrator' } }))
    ) {
      throw new UnauthorizedException(
        'To create doctor you must be administrator',
      );
    }

    return this.usersService.createSpecialty(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('doctor')
  async doctorCreate(
    @Req() req: AuthenticatedRequest,
    @Body() Body: CreateDoctorDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (
      !(await this.roleRepository.findOne({ where: { name: 'administrator' } }))
    ) {
      throw new UnauthorizedException(
        'To create doctor you must be administrator',
      );
    }
    return this.usersService.createDoctor(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('doctor/:id')
  async doctorDelete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
  ) {
    // Проверка, существует ли пользователь
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Проверка, является ли пользователь администратором
    const isAdmin = await this.roleRepository.findOne({
      where: { name: 'administrator' },
    });

    if (!isAdmin) {
      throw new UnauthorizedException(
        'Для удаления врача вы должны быть администратором',
      );
    }
    return await this.usersService.deleteDoctor(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('specialty/:id')
  async specialtyDelete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
  ) {
    // Проверка, существует ли пользователь
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Проверка, является ли пользователь администратором
    const isAdmin = await this.roleRepository.findOne({
      where: { name: 'administrator' },
    });

    if (!isAdmin) {
      throw new UnauthorizedException(
        'Для удаления специальности вы должны быть администратором',
      );
    }

    // Удаление специальности через сервис
    return await this.usersService.deleteSpecialty(id);
  }

  @Get('appointments')
  async getAppointments(@Query('id') id : number){
    return this.usersService.getAppointments(id)
  }
}
