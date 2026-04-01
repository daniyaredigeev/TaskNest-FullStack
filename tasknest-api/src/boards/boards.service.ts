import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class BoardsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateBoardDto) {
    return this.prismaService.board.create({
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async findAll(user: any) {
    return this.prismaService.board.findMany({
      include: {
        tasks: {
          // На главной Dashboard показываем только количество релевантных задач
          where: user.role !== Role.ADMIN ? { userId: user.id } : {},
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: any) {
    const board = await this.prismaService.board.findUnique({
      where: { id },
      include: {
        tasks: {
          // ФИЛЬТР: Юзер видит только свои, Админ видит всё
          where: user.role !== Role.ADMIN ? { userId: user.id } : {},
          include: {
            // ВКЛЮЧАЕМ АВТОРА: Чтобы админ видел, чья это задача
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException(`Доска с ID ${id} не найдена`);
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardsDto) {
    return this.prismaService.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.board.delete({
      where: { id },
    });
  }
}