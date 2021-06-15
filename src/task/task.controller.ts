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
import { Request } from 'express';
import { NotFoundInterceptor } from '../common/interceptors/not-found.interceptor';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Bookmark } from './models/bookmark.model';
import { Comment } from './models/comment.model';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateChildTaskPositionsDto } from './dto/update-child-task-positions.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './models/task.model';

import { TaskService } from './task.service';
import { JWTAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('task')
@UseGuards(JWTAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get('update')
  async gogo() {
    this.taskService.gogo();
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body(ValidationPipe) taskData: CreateTaskDto,
  ): Promise<Task> {
    return await this.taskService.create(req.user, taskData);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const tasks = await this.taskService.findAll(req.user);
    return { tasks };
  }

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('task not found'))
  async findOne(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Task> {
    return await this.taskService.findOne(req.user, id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) taskData: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(req.user, id, taskData);
  }

  @Patch(':taskId/position')
  async updateChildTaskPositions(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(ValidationPipe) positionData: UpdateChildTaskPositionsDto,
  ): Promise<void> {
    return await this.taskService.updateChildTaskPositions(
      req.user,
      taskId,
      positionData,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.taskService.remove(req.user, id);
  }

  /* for commnet from below */
  @Post(':id/comment')
  async addComment(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) commentData: CreateCommentDto,
  ): Promise<any> {
    return await this.taskService.addComment(req.user, id, commentData);
  }

  @Get(':id/comment')
  async findComments(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const comments = await this.taskService.findComments(req.user, id);
    return { comments };
  }

  @Patch(':taskId/comment/:commentId')
  async updateComment(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body(ValidationPipe) commentData: UpdateCommentDto,
  ): Promise<Comment> {
    return await this.taskService.updateComment(
      req.user,
      taskId,
      commentId,
      commentData,
    );
  }

  @Delete(':taskId/comment/:commentId')
  async removeComment(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return await this.taskService.removeComment(req.user, taskId, commentId);
  }

  /* for bookmark from below */
  @Post(':id/bookmark')
  async addBookmark(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) bookmarkData: CreateBookmarkDto,
  ): Promise<Bookmark> {
    return await this.taskService.addBookmark(req.user, id, bookmarkData);
  }

  @Get(':id/bookmark')
  async findBookmarks(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const bookmarks = await this.taskService.findBookmarks(req.user, id);
    return { bookmarks };
  }

  @Delete(':taskId/bookmark/:bookmarkId')
  async removeBookmark(
    @Req() req: Request,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('bookmarkId', ParseUUIDPipe) bookmarkId: string,
  ): Promise<void> {
    return await this.taskService.removeBookmark(req.user, taskId, bookmarkId);
  }
}
