import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'; // Добавляем ApiQuery
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from 'src/generated/prisma/enums';

@ApiTags('Задачи (Tasks)') // Группировка в UI
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создать новую задачу' })
  @ApiResponse({ status: 201, description: 'Задача создана.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все задачи' })
  @ApiQuery({ 
    name: 'status', 
    enum: TaskStatus, 
    required: false, 
    description: 'Фильтрация задач по статусу' 
  })
  findAll(@Query('status') status?: TaskStatus) {
    return this.tasksService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить задачу' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}