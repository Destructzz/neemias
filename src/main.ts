import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 8080;

  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Убирает свойства, которых нет в DTO
        forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть неизвестные свойства
        transform: true, // Автоматически преобразует типы данных (например, строки в числа)
    }),
  );
  app.use(cookieParser())

  app.enableCors();
  await app.listen(PORT);
  console.log(`server is listening on http://localhost:${PORT}`);
}
bootstrap();
