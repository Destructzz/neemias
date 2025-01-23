import { Controller, Get, Res, UnauthorizedException, UseGuards, Req} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { join } from 'path';
import { Role } from 'src/users/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthenticatedRequest } from 'src/users/interface/user.interface';
import { Repository } from 'typeorm';
@Controller()
export class PageController {
    constructor(
        private readonly configService : ConfigService,
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository : Repository<Role>,
    ){}
    @Get()
    getMainPage(@Res() res : Response): void {
        const filePath = join(__dirname, '..', '..', 'public', 'main', 'main.html')
        res.sendFile(filePath)
    }
    @Get('auth')
    getAuthPage(@Res() res : Response) : void{
        const filePath = join(__dirname, '..', '..', 'public', 'auth', 'auth.html')
        res.sendFile(filePath)
    }
    // @UseGuards(AuthGuard('jwt'))
    @Get('admin-panel')
    async getAdminPanelPage(@Res() res : Response, @Req() req : AuthenticatedRequest){
        const user = await this.userRepository.findOne({where : {id : req.user.userId}})

        const isAdministrator = user.roles.some(role => role.name === 'administrator');

        if(!isAdministrator){
            // throw new UnauthorizedException('only the administrator has access to this resource.')
        }
        
        const filePath = join(__dirname, '..', '..', 'public', 'admin-panel', 'admin-panel.html')
        res.sendFile(filePath)
    }
    @Get('profile')
    getProfilePage(@Res() res : Response) : void{
        const filePath = join(__dirname, '..', '..', 'public', 'profile', 'profile.html')
        res.sendFile(filePath)
    }
}
