import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from './enums/task-status.enum';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание: userId привязывается автоматически
  async create(dto: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  // Поиск всех: фильтруем, если не ADMIN
  async findAll(user: any, status?: TaskStatus) {
    const whereCondition: any = {};
    
    if (status) {
      whereCondition.status = status;
    }

    // Если НЕ админ — добавляем фильтр по владельцу
    if (user.role !== Role.ADMIN) {
      whereCondition.userId = user.id;
    }

    return this.prisma.task.findMany({
      where: whereCondition,
      include: { 
        board: true, 
        user: { select: { name: true, email: true } } 
      },
    });
  }

  // Поиск одной: проверяем доступ
  async findOne(id: string, user: any) {
    const task = await this.prisma.task.findUnique({ 
        where: { id },
        include: { user: true }
    });

    if (!task) throw new NotFoundException('Задача не найдена');

    // Если не админ и не владелец — 403
    if (user.role !== Role.ADMIN && task.userId !== user.id) {
      throw new ForbiddenException('Нет доступа к чужой задаче');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.findOne(id, user); // Используем логику проверки из findOne

    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, user: any) {
    await this.findOne(id, user); // Используем логику проверки из findOne

    return await this.prisma.task.delete({ where: { id } });
  }
}