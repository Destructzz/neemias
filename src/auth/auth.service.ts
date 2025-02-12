import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async login(id : number, res: any) {
    const token = await this.generateToken({ userId: id });

    const user = await this.userRepository.findOne({where : {id}})

    console.log(`login authservice - ${user.username}`)
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
