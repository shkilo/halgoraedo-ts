import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), ProjectModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
