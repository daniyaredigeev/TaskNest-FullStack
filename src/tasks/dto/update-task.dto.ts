import { IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Title должен быть строкой' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status должен быть TODO, IN_PROGRESS или DONE' })
  status?: TaskStatus;

  @IsOptional()
  @IsInt({ message: 'boardId должен быть числом' })
  @Min(1, { message: 'boardId должен быть >= 1' })
  boardId?: string;

  @IsOptional()
  @IsInt({ message: 'userId должен быть числом' })
  @Min(1, { message: 'userId должен быть >= 1' })
  userId?: string;
}