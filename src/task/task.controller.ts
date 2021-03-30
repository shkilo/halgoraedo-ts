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
import { CreateTaskDto } from './dto/creat-task.dto';
import { UpdateTaskDto } from './dto/update-taske.dto';
import { Task } from './task.model';

import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(ValidationPipe) taskData: CreateTaskDto,
  ): Promise<Task> {
    return await this.taskService.create(req.user, taskData);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<Task[]> {
    return await this.taskService.findAll(req.user);
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('project not found'))
  async findOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return await this.taskService.findOne(req.user, id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) taskData: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(req.user, id, taskData);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.taskService.remove(req.user, id);
  }
}
