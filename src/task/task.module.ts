import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ProjectModule } from '../project/project.module';
import { Comment } from './models/comment.model';
import { Bookmark } from './models/bookmark.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Comment, Bookmark]),
    ProjectModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
