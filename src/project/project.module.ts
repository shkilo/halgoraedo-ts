import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from './models/project.model';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Section } from './models/section.model';

@Module({
  imports: [SequelizeModule.forFeature([Project, Section])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
