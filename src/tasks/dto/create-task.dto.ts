import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from 'src/generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Купить продукты' })
  @IsString({ message: 'Title должен быть строкой' })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Молоко, хлеб, сыр' })
  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  description?: string;

  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ example: 'board-uuid-123' })
  @IsString({ message: 'boardId должен быть строкой' })
  @IsNotEmpty()
  boardId: string; // Теперь валидатор соответствует типу

  @ApiProperty({ example: 'user-uuid-456' })
  @IsString({ message: 'userId должен быть строкой' })
  @IsNotEmpty()
  userId: string; // Теперь валидатор соответствует типу
}