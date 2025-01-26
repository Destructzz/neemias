import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/password/password.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Response } from 'express';
import { Specialty } from './entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { Record } from 'src/records/entities/record.entity';

@Injectable()
export class UsersService {
    constructor(
        private readonly passwordService : PasswordService,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        @InjectRepository(Doctor)
        private readonly doctorRepository : Repository<Doctor>,
        @InjectRepository(Specialty)
        private readonly specialtyRepository : Repository<Specialty>,
        @InjectRepository(Record)
        private readonly recordRepository : Repository<Record>,
        private readonly authService : AuthService,
    ){}

    async register(username: string, password: string) {
        const user = await this.userRepository.findOne({ where: { username } });
    
        if (user) {
            throw new ConflictException('this user already exists');
        }
    
        const hash = await this.passwordService.hashPassword(password);
    
        const newUser = this.userRepository.create({ username, hash});
    
        await this.userRepository.save(newUser);
    }
    
    async login(username: string, password: string, res: Response) {
        const user = await this.userRepository.findOne({ where: { username } });
    
        if (!user) {
            throw new UnauthorizedException('incorrect username');
        }
    
        if (!(await this.passwordService.comparePassword(password, user.hash))) {
            throw new UnauthorizedException('incorrect password');
        }
    
        return this.authService.login(user.id, res);
    }
    

    async createDoctor(data: CreateDoctorDto) {
        // Поиск специальности
        const specialty = await this.specialtyRepository.findOne({
            where: { name: data.specialty },
        });
    
        if (!specialty) {
            throw new BadRequestException('Специальность не найдена');
        }
    
        // Проверка на существование врача по ФИО
        const existingDoctor = await this.doctorRepository.findOne({
            where: {
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                specialty: specialty
            },
        });
    
        if (existingDoctor) {
            throw new ConflictException('Доктор с таким именем и специальностью уже существует');
        }
    
        // Создание нового врача
        const doctor = this.doctorRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            specialty: specialty,
            records: [],
        });
    
        await this.doctorRepository.save(doctor);
    
        return { message: 'Doctor successfully created' };
    }
    

    async createSpecialty(body: CreateSpecialtyDto) {
        // Проверка, существует ли специальность с таким именем
        const existingSpecialty = await this.specialtyRepository.findOne({
            where: { name: body.name },
        });
    
        if (existingSpecialty) {
            throw new ConflictException('Специальность с таким именем уже существует');
        }
    
        // Создание новой специальности
        const specialty = this.specialtyRepository.create({
            name: body.name.trim(),  // Убираем лишние пробелы, если есть
        });
    
        await this.specialtyRepository.save(specialty);
    
        return { message: 'Specialty successfully created' };
    }

    async getDoctor(){
        return await this.doctorRepository.find()
    }

    async getSpecialty(){
        return await this.specialtyRepository.find()
    }
    
    async deleteDoctor(id : number){
        const doctor = await this.doctorRepository.findOne({where : {id}})

        if(!doctor){
            throw new BadRequestException('user is doesn\'t exist')
        }
        await this.doctorRepository.delete(doctor)
        return {message : 'doctor successfuly delete'}
    }

    async deleteSpecialty(id: number) {
        const specialty = await this.specialtyRepository.findOne({ where: { id } });
    
        if (!specialty) {
            throw new BadRequestException('Specialty does not exist');
        }
    
        await this.specialtyRepository.delete(id);
        return { message: 'Specialty successfully deleted' };
    }

    async getAppointments(id : number){
        const doctor = await this.doctorRepository.findOne({where : {id}})
        if(!doctor){
            throw new BadRequestException('this doctor doesn\'t exist')
        }

        return await this.recordRepository.find({
            where : {doctor : {id : doctor.id}},
            select : ['date', 'id'],
            order : {date : 'ASC'},
        })
    }
}
