import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { Task } from '../task/task.model';
import { User } from '../user/user.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.model';
import { Section } from './section.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async create(user: User, projectData: CreateProjectDto): Promise<Project> {
    const newProject: Project = await user.$create('project', projectData);
    await newProject.$create('section', {});

    return newProject;
  }

  async findAll(user: User): Promise<Project[]> {
    return await user.$get('projects', {
      attributes: [
        'id',
        'title',
        'color',
        'isFavorite',
        'isList',
        'createdAt',
        [
          sequelize.fn('COUNT', sequelize.col('sections.tasks.id')),
          'taskCount',
        ],
        [sequelize.col('sections.id'), 'defaultSectionId'],
      ],
      include: [
        {
          model: this.sectionModel,
          attributes: [],
          include: [
            {
              model: this.taskModel,
              required: false,
              attributes: [],
              where: { isDone: false, parentId: null },
            },
          ],
        },
      ],
      group: ['id', 'sections.id'],
      order: [
        ['createdAt', 'ASC'],
        ['sections', 'position', 'ASC'],
      ],
    });
  }

  async findOne(user: User, id: number): Promise<Project> {
    const result = await user.$get('projects', {
      attributes: ['id', 'title', 'isList'],
      include: {
        model: this.sectionModel,
        include: [
          {
            model: this.taskModel,
            where: { parentId: null },
            include: [
              {
                model: this.taskModel,
                as: 'childTasks',
              },
            ],
            required: false,
          },
        ],
      },
      order: [
        ['sections', 'position', 'ASC'],
        ['sections', 'tasks', 'position', 'ASC'],
        ['sections', 'tasks', 'childTasks', 'position', 'ASC'],
      ],
      where: {
        id,
      },
    });
    const project = result[0];

    if (!project) {
      throw new EntityNotFoundException();
    }

    return project;
  }

  async update(
    user: User,
    id: number,
    projectData: UpdateProjectDto,
  ): Promise<Project> {
    const result = await user.$get('projects', {
      where: {
        id,
      },
    });
    const project = result[0];

    if (!project) {
      throw new EntityNotFoundException();
    }

    return await project.update(projectData);
  }

  async remove(user: User, id: number): Promise<void> {
    const result = await user.$get('projects', {
      where: {
        id,
      },
    });
    const project = result[0];

    if (!project) {
      throw new EntityNotFoundException();
    }

    return await project.destroy();
  }
}
