import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, Delete, Get, Param, Res} from '@nestjs/common';
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

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository : Repository<Role>,
  ) {}
  @Post('user/register')
  async register(@Body() body : CreateUserDto){
    this.usersService.register(body.username, body.password)
    return {message : 'user registered successfuly!'}
  }
  @Post('user/login')
  async login(@Body() body : CreateUserDto, @Res() res : Response){
    await this.usersService.login(body.username, body.password, res)
    res.status(200).json({message: 'Login successful'})
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('user/check')
  async check(@Req() req : AuthenticatedRequest){
    const user = await this.userRepository.findOne({where : {id : req.user.userId}})
    return {username : user.username}
  }
  
  @Get('logout')
  async logout(@Res() res : Response){
    res.clearCookie('jwt')
    return { message: 'Logout successful' };
  }

  @Get('doctor')
  async getDoctor(){
    return this.usersService.getDoctor();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('doctor')
  async doctorCreate(@Req() req : AuthenticatedRequest, @Body() Body : CreateDoctorDto){
    const user = await this.userRepository.findOne({where : {id : req.user.userId}})

    if(!await this.roleRepository.findOne({where : {name : 'administrator'}})){
      throw new UnauthorizedException('To create doctor you must be administrator')
    }
    return this.usersService.createDoctor(Body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('doctor:id')
  async doctorDelete(@Req() req : AuthenticatedRequest, @Param('id') id : number){
    const user = await this.userRepository.findOne({where : {id : req.user.userId}})

    if(!await this.roleRepository.findOne({where : {name : 'administrator'}})){
      throw new UnauthorizedException('To delete doctor you must be administrator')
    }
    this.usersService.deleteDoctor(id)
  }
}
