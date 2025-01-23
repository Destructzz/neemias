import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
    imports : [
        TypeOrmModule.forRootAsync({
            useFactory : (configService : ConfigService) => ({
                type : "postgres",
                host : configService.getOrThrow('POSTGRES_HOST'),
                port : configService.getOrThrow('POSTGRES_PORT'),
                database : configService.getOrThrow('POSTGRES_DATABASE'),
                username : configService.getOrThrow('POSTGRES_USERNAME'),
                password : configService.getOrThrow('POSTGRES_PASSWORD'),
                autoLoadEntities : true,
                synchronize : configService.getOrThrow('POSTGRES_SYNCHRONIZE'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            }),
            inject : [ConfigService]
        }),
    ]
})
export class DatabaseModule {}
