import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports : [
        PassportModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject : [ConfigService],
            useFactory : (configService : ConfigService) => ({
                secret : configService.getOrThrow('JWT_SECRET'),
                signOptions : {expiresIn : '1h'},
            })
        })
    ],
    providers : [AuthService, JwtStrategy],
    exports : [AuthService]
})

export class AuthModule {}
