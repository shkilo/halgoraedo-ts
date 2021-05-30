import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Sequelize } from 'sequelize';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { Task } from '../task/models/task.model';
import { User } from '../user/user.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateSectionTaskPositionsDto } from './dto/update-section-task-positions.dto';
import { Project } from './models/project.model';
import { Section } from './models/section.model';

@Injectable()
export class ProjectService {
  constructor(
    private readonly conn: Sequelize,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async create(user: User, projectData: CreateProjectDto): Promise<Project> {
    return await this.projectModel.create(
      {
        ...projectData,
        creatorId: user.id,
        sections: [{}],
      },
      { include: Section },
    );
  }

  async findAll(user: User): Promise<Project[]> {
    return await this.projectModel.findAll({
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
          model: Section,
          attributes: [],
          include: [
            {
              model: Task,
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
      where: {
        creatorId: user.id,
      },
    });
  }

  async findOne(user: User, id: string): Promise<Project> {
    const project = await this.projectModel.findOne({
      attributes: ['id', 'title', 'isList'],
      include: {
        model: Section,
        include: [
          {
            model: Task,
            where: { parentId: null },
            include: ['tasks'],
            required: false,
          },
        ],
      },
      order: [
        ['sections', 'position', 'ASC'],
        ['sections', 'tasks', 'position', 'ASC'],
        ['sections', 'tasks', 'tasks', 'position', 'ASC'],
      ],
      where: {
        id,
        creatorId: user.id,
      },
    });

    if (!project) {
      throw new EntityNotFoundException();
    }

    return project;
  }

  async update(
    user: User,
    id: string,
    projectData: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(user, id);
    return await project.update(projectData);
  }

  async remove(user: User, id: string): Promise<void> {
    const project = await this.findOne(user, id);
    return await project.destroy();
  }

  async addSection(
    user: User,
    projectId: string,
    sectionData: CreateSectionDto,
  ) {
    const project = await this.findOne(user, projectId);
    const maxPosition = project.sections.reduce(
      (maxPos, { position }) => Math.max(maxPos, position),
      0,
    );

    return await project.$create('section', {
      ...sectionData,
      position: maxPosition + 1,
    });
  }

  async findSection(user: User, projectId: string, sectionId: string) {
    const project = await this.findOne(user, projectId);
    const section = project.sections.find(({ id }) => id === sectionId);

    if (!section) {
      throw new EntityNotFoundException();
    }

    return section;
  }

  async updateSection(
    user: User,
    projectId: string,
    sectionId: string,
    sectionData: CreateSectionDto,
  ) {
    const section = await this.findSection(user, projectId, sectionId);
    return await section.update(sectionData);
  }

  async updateSectionTaskPositions(
    user: User,
    projectId: string,
    sectionId: string,
    positionData: UpdateSectionTaskPositionsDto,
  ) {
    const section = await this.findSection(user, projectId, sectionId);
    const { orderedTasks } = positionData;

    await this.conn.transaction(async (t) => {
      await Promise.all(
        orderedTasks.map(async (id, position) => {
          const [task] = await section.$get('tasks', { where: { id } });
          await task.update({ position, parentId: null }, { transaction: t });
        }),
      );
    });
  }

  async removeSection(user: User, projectId: string, sectionId: string) {
    const section = await this.findSection(user, projectId, sectionId);
    return await section.destroy();
  }
}
