import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';

@Injectable()
export class BoardsService {
constructor(private readonly prismaService: PrismaService) {}

   async create(dto: CreateBoardDto) {
    return this.prismaService.board.create({
      data: dto,
    });
  }

    async findAll() {
        return this.prismaService.board.findMany();
    }

    async findOne(id: string) {
        return this.prismaService.board.findUnique({
            where: { id },
        });
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