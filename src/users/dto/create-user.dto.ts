import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Импорт декоратора

export class CreateUserDto {
  @ApiProperty() // Добавляем для отображения в Swagger
  @IsEmail()
  email: string;

  @ApiProperty() // Добавляем для отображения в Swagger
  @IsString()
  @MinLength(2)
  name: string;
}