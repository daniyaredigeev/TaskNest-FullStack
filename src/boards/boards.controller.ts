import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardsDto } from './dto/update-boards.dto';


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
  findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardsDto) {
    return this.boardsService.update(id, updateBoardDto);
  } 


    @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}

