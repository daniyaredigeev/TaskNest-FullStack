import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}



/* В UsersService.create()
пользователь создаётся напрямую через data: dto, а в findAll() и findOne()
возвращаются полные записи пользователя. Это опасно, потому что пароль может
попасть в ответ, и создание пользователя идёт в обход auth-логики с
хешированием.
 */

/* import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2'; // Импортируем для хэширования

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Шаблон полей, которые МОЖНО отдавать наружу (паспорта/хэша тут нет)
  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(dto: CreateUserDto) {
    // 1. Хэшируем пароль прямо здесь, чтобы никто не создал юзера "в обход"
    const hashedPassword = await argon2.hash(dto.password);

    // 2. Сохраняем и возвращаем результат БЕЗ пароля
    return await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: this.userSelect,
    });
  }

  async findAll() {
    // Возвращаем массив пользователей без хэшей паролей
    return await this.prisma.user.findMany({
      select: this.userSelect,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  // Спец-метод для AuthModule (ему пароль НУЖЕН для сравнения при логине)
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      // Тут НЕ используем select, чтобы достать пароль для проверки
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
  }
} */