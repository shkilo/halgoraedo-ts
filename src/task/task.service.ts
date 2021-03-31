import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectService } from '../project/project.service';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { Task } from './task.model';
import { User } from '../user/user.model';
import { CreateTaskDto } from './dto/creat-task.dto';
import { UpdateTaskDto } from './dto/update-taske.dto';
import { Sequelize } from 'sequelize';

@Injectable()
export class TaskService {
  constructor(
    private readonly conn: Sequelize,
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

    return await this.conn.transaction(async (t) => {
      const transactionHost = { transaction: t };

      const newTask = await this.taskModel.create(
        {
          ...taskData,
          position: maxPostion + 1,
        },
        transactionHost,
      );
      await newTask.$set('section', section, transactionHost);
      await newTask.$set('creator', user, transactionHost);

      return newTask;
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
