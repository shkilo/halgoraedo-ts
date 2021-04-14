import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectService } from '../project/project.service';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-taske.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly projectService: ProjectService,
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async create(user: User, taskData: CreateTaskDto): Promise<Task> {
    const section = await this.projectService.findSection(
      user,
      taskData.projectId,
      taskData.sectionId,
    );

    const tasks = await section.$get('tasks');
    const maxPostion = tasks.reduce(
      (maxPos, task) => Math.max(maxPos, task.position),
      0,
    );

    return await this.taskModel.create({
      ...taskData,
      position: maxPostion + 1,
      creatorId: user.id,
      sectionId: section.id,
    });
  }

  async findAll(user: User): Promise<Task[]> {
    return await this.taskModel.findAll({ where: { creatorId: user.id } });
  }

  async findOne(user: User, id: number): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id, creatorId: user.id },
    });

    if (!task) {
      throw new EntityNotFoundException();
    }

    return task;
  }

  async update(user: User, id: number, taskData: UpdateTaskDto) {
    const task = await this.findOne(user, id);
    return await task.update(taskData);
  }

  async remove(user: User, id: number) {
    const task = await this.findOne(user, id);
    return await task.destroy();
  }
}
