import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) {}

    async create(createBoardDto: CreateBoardDto) {
        return this.prisma.board.create({
            data: createBoardDto,
        });
    } 

    async findAll() {
        return this.prisma.board.findMany();
    }

    async findOne(id: string) {
        return this.prisma.board.findUnique({
            where: { id },
        });
    }

    async remove(id: string) {
        return this.prisma.board.delete({
            where: { id },
        });
    }

    
}