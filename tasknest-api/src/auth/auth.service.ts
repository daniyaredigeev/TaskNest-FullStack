import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.dto';
import type { Request, Response } from 'express';
import { isDev } from 'src/utils/is-dev-utils';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterRequest) {
    const { email, name, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password),
      },
    });
    return this.auth(res, user.id);
  }

 async login(res: Response, dto: LoginRequest) {
  const { email, password } = dto;
  
  const user = await this.prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  // ИСПРАВЛЕНИЕ 1: Если пользователь не найден — 401 вместо 404
  if (!user) {
    throw new UnauthorizedException('Неверный email или пароль');
  }

  const isValidPassword = await verify(user.password, password);

  // ИСПРАВЛЕНИЕ 2: Если пароль неверный — 401 вместо 404
  // ИСПРАВЛЕНИЕ 3: Сообщение такое же, как выше, чтобы не раскрывать детали
  if (!isValidPassword) {
    throw new UnauthorizedException('Неверный email или пароль');
  }

  return this.auth(res, user.id);
}

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Отсутствует refresh token');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return this.auth(res, user.id);
    }
  }

  async logout(res: Response) {
    this.setCookie(res, '', new Date(0));
    return { message: 'Вы успешно вышли из аккаунта' };
  }

  async validateUser(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true },
  });

  // ИСПРАВЛЕНИЕ: Используем UnauthorizedException (401) вместо NotFoundException (404)
  if (!user) {
    throw new UnauthorizedException('Доступ запрещен: пользователь не найден');
  }

  return user;
}

async getMe(id: string) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,   // ОБЯЗАТЕЛЬНО ДОБАВЛЯЕМ
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Пользователь не найден');
  }

  return user;
}


  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);
    this.setCookie(
      res,
      refreshToken,
      new Date(60 * 60 * 24 * 1000 + Date.now()),
    );
    return { accessToken };
  }

  private generateTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as unknown as any,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as unknown as any,
    });

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, token: string, expires: Date) {
    res.cookie('refreshToken', token, {
      expires,
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: !isDev(this.configService),
      sameSite: !isDev(this.configService) ? 'none' : 'lax',
    });
  }




}