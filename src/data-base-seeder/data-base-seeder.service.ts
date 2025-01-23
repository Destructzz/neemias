import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/password/password.service';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataBaseSeederService implements OnModuleInit{
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository : Repository<Role>,
        private readonly passwordService : PasswordService,
    ){}
    async onModuleInit() {
        this.seed()
    }
    async seed() {
        // Проверяем существование роли 'administrator'
        let role = await this.roleRepository.findOne({ where: { name: 'administrator' } });
    
        // Если роль не найдена, создаем её
        if (!role) {
            role = this.roleRepository.create({ name: 'administrator' });
            await this.roleRepository.save(role);
            console.log('Administrator role has been created.');
        } else {
            console.log('Administrator role already exists.');
        }
    
        // Проверяем существование пользователя 'admin'
        const admin = await this.userRepository.findOne({ where: { username: 'admin' } });
    
        // Если пользователя нет, создаем его и привязываем ранее созданную или найденную роль
        if (!admin) {
            const newAdmin = this.userRepository.create({
                username: 'admin',
                hash: await this.passwordService.hashPassword('v2025'),
                roles: [role], // Привязываем существующую роль
            });
    
            await this.userRepository.save(newAdmin);
            console.log('Admin user has been created.');
        } else {
            console.log('Admin user already exists.');
        }
    }        
}
