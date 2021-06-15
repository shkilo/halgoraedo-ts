import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JWTAuthGuard } from '../common/guards/jwt-auth.guard';
import { NotFoundInterceptor } from '../common/interceptors/not-found.interceptor';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateSectionTaskPositionsDto } from './dto/update-section-task-positions.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Project } from './models/project.model';
import { Section } from './models/section.model';
import { ProjectService } from './project.service';

@Controller('project')
@UseGuards(JWTAuthGuard)
@UseInterceptors(new NotFoundInterceptor('project not found'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(ValidationPipe) projectData: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.create(req.user, projectData);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const projectInfos = await this.projectService.findAll(req.user);
    return { projectInfos };
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    const project = await this.projectService.findOne(req.user, id);
    return { project };
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) projectData: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.update(req.user, id, projectData);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.projectService.remove(req.user, id);
  }

  @Post(':id/section')
  async addSection(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) sectionData: CreateSectionDto,
  ): Promise<any> {
    return await this.projectService.addSection(req.user, id, sectionData);
  }

  @Patch(':projectId/section/:sectionId')
  async updateSection(
    @Req() req: Request,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body(ValidationPipe) sectionData: UpdateSectionDto,
  ): Promise<Section> {
    return await this.projectService.updateSection(
      req.user,
      projectId,
      sectionId,
      sectionData,
    );
  }

  @Patch(':projectId/section/:sectionId/task/position')
  async updateSectionTaskPositions(
    @Req() req: Request,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body(ValidationPipe) positionData: UpdateSectionTaskPositionsDto,
  ): Promise<void> {
    return await this.projectService.updateSectionTaskPositions(
      req.user,
      projectId,
      sectionId,
      positionData,
    );
  }

  @Delete(':projectId/section/:sectionId')
  async removeSection(
    @Req() req: Request,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
  ): Promise<void> {
    return await this.projectService.removeSection(
      req.user,
      projectId,
      sectionId,
    );
  }
}
