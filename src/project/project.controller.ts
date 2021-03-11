import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.model';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Post()
  // async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
  //   return await this.projectService.create(createProjectDto);
  // }

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('project not found'))
  async findOne(@Param('id') id: string): Promise<Project> {
    return await this.projectService.findOne(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<void> {
  //   return this.userService.remove(id);
  // }
}
