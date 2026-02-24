import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TasksModule } from './–no-spec/tasks/tasks.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [BoardsModule, PrismaModule, UsersModule, MoviesModule, ReviewsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
