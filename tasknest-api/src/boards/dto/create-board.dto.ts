import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ 
    example: 'План на неделю', 
    description: 'Название доски' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({ 
    example: 'Список задач для команды разработки', 
    description: 'Детальное описание предназначения доски',
    required: false 
  })
  @IsString()
  @IsOptional()
  description: string;
}