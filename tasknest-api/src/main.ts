import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { setupSwagger } from '../utils/swagger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
  origin: 'http://localhost:3001', // Адрес твоего Next.js приложения
  credentials: true, // ОБЯЗАТЕЛЬНО для работы с cookies
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  
  await app.listen(3000);
}
bootstrap();