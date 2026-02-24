import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
 
  constructor(private readonly prisma: PrismaService) {}
   async create(dto: CreateTaskDto) {
    return await this.prisma.task.create({ data: dto });
  }

 async findAll() {
  return await this.prisma.task.findMany({
    include: {
      board: true,  // включаем доску
      user: true,   // включаем пользователя
    },
  });
}

  

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return await this.prisma.task.update({ where: { id }, data: updateTaskDto });
  }

    async findOne(id: string) {
    return await this.prisma.task.findUnique({ where: { id } });
  }

  async remove(id: string) {
    return await this.prisma.task.delete({ where: { id } });
  }
}

