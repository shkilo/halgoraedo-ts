import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotFoundInterceptor } from '../common/interceptors/not-found.interceptor';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(ValidationPipe) createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.create(req.user, createProjectDto);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<Project[]> {
    return await this.projectService.findAll(req.user);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('project not found'))
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project> {
    return await this.projectService.findOne(req.user, id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) projectData: UpdateProjectDto,
  ): Promise<Project> {
    return await this.projectService.update(req.user, id, projectData);
  }

  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.projectService.remove(req.user, id);
  }
}
