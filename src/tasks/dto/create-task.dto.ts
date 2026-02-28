import { IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty() // Добавлено
  @IsString({ message: 'Title должен быть строкой' })
  title: string;

  @ApiProperty({ required: false }) // Добавлено
  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  description?: string;

  @ApiProperty({ enum: TaskStatus }) // Добавлено
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty() // Добавлено
  @IsInt({ message: 'boardId должен быть числом' })
  @Min(1)
  boardId: string;

  @ApiProperty() // Добавлено
  @IsInt({ message: 'userId должен быть числом' })
  @Min(1)
  userId: string;
}