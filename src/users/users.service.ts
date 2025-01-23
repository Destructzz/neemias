import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/password/password.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Response } from 'express';

@Injectable()
export class UsersService {
    constructor(
        private readonly passwordService : PasswordService,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        @InjectRepository(Doctor)
        private readonly doctorRepository : Repository<Doctor>,
        private readonly authService : AuthService,
    ){}
    async register(username : string, password : string){
        const user = await this.userRepository.findOne({where : {username : username}})

        if (user) throw new ConflictException('This user is already exists');

        const newUser = this.userRepository.create({username : username, hash : await this.passwordService.hashPassword(password)})

        await this.userRepository.save(newUser)
    }
    async login(username : string, password : string, res : Response){
        const user = await this.userRepository.findOne({where : {username}})

        if (!user) throw new UnauthorizedException('This user doesn\'t exist');

        if(!await this.passwordService.comparePassword(password, user.hash)){
            throw new UnauthorizedException('Password is incorect')
        }
        this.authService.login(user.id, res)
    }

    async createDoctor(data : CreateDoctorDto){
        const doctor = this.doctorRepository.create()
    }

    async getDoctor(){
        return await this.doctorRepository.find()
    }
    
    async deleteDoctor(id : number){
        const doctor = await this.doctorRepository.findOne({where : {id}})

        if(!doctor){
            throw new BadRequestException('user is doesn\'t exist')
        }
        await this.doctorRepository.delete(doctor)
        return {message : 'user successfuly delete'}
    }
}
