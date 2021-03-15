import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './project.model';
import { Section } from './section.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [SequelizeModule.forFeature([Project, Section]), TaskModule],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
