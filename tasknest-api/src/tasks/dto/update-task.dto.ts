import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Обновленное название' })
  @IsOptional()
  @IsString({ message: 'Title должен быть строкой' })
  title?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание' })
  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status должен быть TODO, IN_PROGRESS или DONE',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 'uuid-доски' })
  @IsOptional()
  @IsString({ message: 'boardId должен быть строкой (UUID)' })
  boardId?: string;

  // userId убираем, так как клиент не должен его менять
}