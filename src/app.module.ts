import { Module } from '@nestjs/common';
import { PageModule } from './page/page.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecordModule } from './records/record.module';
import { PasswordModule } from './password/password.module';
import { DataBaseSeederModule } from './data-base-seeder/data-base-seeder.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PageModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    RecordModule,
    PasswordModule,
    DataBaseSeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
