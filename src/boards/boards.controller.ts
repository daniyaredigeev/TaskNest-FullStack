import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';


@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post('create')
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }


  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  findOne(id: string) {
    return this.boardsService.findOne(id);
  }

  @Delete(':id')
  remove(id: string) {
    return this.boardsService.remove(id);
  }
}