import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
 
  async create(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: dto
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }



update(id: string, updateUserDto: UpdateUserDto) {
  return this.prisma.user.update({
    where: { id },
    data: updateUserDto,
  });
}


  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}