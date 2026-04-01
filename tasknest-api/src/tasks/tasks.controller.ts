import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Authorization } from 'src/auth/decorators/authoration.decorator';

@ApiTags('Задачи (Tasks)')
@ApiBearerAuth()
@Authorization() // Твой декоратор для защиты маршрутов
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить задачи (Админ видит все, юзер — свои)' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  findAll(
    @Authorized() user: any, // Получаем весь объект юзера (id + role)
    @Query('status') status?: TaskStatus
  ) {
    return this.tasksService.findAll(user, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить конкретную задачу' })
  findOne(@Param('id') id: string, @Authorized() user: any) {
    return this.tasksService.findOne(id, user);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую задачу' })
  create(
    @Body() createTaskDto: CreateTaskDto, 
    @Authorized('id') userId: string 
  ) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу (Владелец или Админ)' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Authorized() user: any 
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу (Владелец или Админ)' })
  remove(
    @Param('id') id: string,
    @Authorized() user: any
  ) {
    return this.tasksService.remove(id, user);
  }
}