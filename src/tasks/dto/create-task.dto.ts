import { IsInt, IsOptional, IsString, IsEnum, Min } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';


export class CreateTaskDto {
  @IsString({ message: 'Title должен быть строкой' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description должен быть строкой' })
  description?: string;

   @IsEnum(TaskStatus)
    status: TaskStatus;

  @IsInt({ message: 'boardId должен быть числом' })
  @Min(1)
  boardId: string;

  @IsInt({ message: 'userId должен быть числом' })
  @Min(1)
  userId: string;
}