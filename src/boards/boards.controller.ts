import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'; // Импортируем Swagger декораторы
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';

@ApiTags('Доски (Boards)') // Группирует эндпоинты в Swagger UI
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создать новую доску' })
  @ApiResponse({ status: 201, description: 'Доска успешно создана.' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех досок' })
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить одну доску по ID' })
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные доски' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardsDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить доску' })
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}