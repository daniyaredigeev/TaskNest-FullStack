import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';
import { Authorization } from 'src/auth/decorators/authoration.decorator'; 
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@ApiTags('Доски (Boards)')
@ApiBearerAuth()
@Authorization() // Требует авторизацию для всего контроллера
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список досок (с фильтрацией задач по роли)' })
  findAll(@Authorized() user: any) {
    return this.boardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить доску и задачи (Админ видит всех, юзер - своих)' })
  findOne(@Param('id') id: string, @Authorized() user: any) {
    return this.boardsService.findOne(id, user);
  }

  @Post('create')
  @Roles(Role.ADMIN) // Только для администраторов
  @ApiOperation({ summary: 'Создать новую доску (Только Admin)' })
  @ApiResponse({ status: 201, description: 'Доска создана.' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Обновить данные доски (Только Admin)' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardsDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Удалить доску (Только Admin)' })
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}