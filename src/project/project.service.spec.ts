import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { User } from '../user/user.model';
import { Section } from './section.model';
import { Task } from '../task/task.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { NotFoundException } from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-project.dto';

const createdProject = {
  id: 1,
  title: '관리함',
  isList: true,
  isFavorite: false,
  color: '#000000',
  creatorId: 1,
};

const foundProjects = [
  {
    id: 71,
    title: 'jaj',
    color: '#000000',
    isFavorite: false,
    isList: true,
    createdAt: '2021-03-16T14:57:24.000Z',
    taskCount: 0,
    defaultSectionId: 71,
  },
];

const foundOneProject = {
  id: 1,
  title: 'title',
  isList: true,
  sections: [
    {
      id: 12,
      title: '기본 섹션',
      color: null,
      position: 0,
      projectId: 12,
      createdAt: '2021-03-15T08:39:33.000Z',
      updatedAt: '2021-03-15T08:39:33.000Z',
      tasks: [],
    },
  ],
};

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project),
          useValue: {
            create: jest.fn(() => ({
              $set: () => undefined,
              $create: () => undefined,
              save: () => createdProject,
            })),
            findAll: jest.fn(() => foundProjects),
            findOne: jest.fn(({ where }) => {
              return where.id === foundOneProject.id
                ? { ...foundOneProject, update: () => undefined }
                : null;
            }),
          },
        },
        {
          provide: getModelToken(Section),
          useValue: {},
        },
        {
          provide: getModelToken(Task),
          useValue: {},
        },
      ],
    }).compile();
    service = modRef.get(ProjectService);
  });

  it('Create project', async () => {
    const user = { id: 1 } as User;
    const dto: CreateProjectDto = {
      title: '관리함',
      isList: true,
      isFavorite: false,
      color: '#000000',
    };
    expect(await service.create(user, dto)).toEqual(createdProject);
  });

  it('Find all project', async () => {
    const user = { id: 1 } as User;
    expect(await service.findAll(user)).toEqual(foundProjects);
  });

  it('Find one project by id', async () => {
    const user = { id: 1 } as User;
    const id = foundOneProject.id;
    const idNotExisting = 404;

    expect(await service.findOne(user, id)).toEqual(foundOneProject);
    expect(
      async () => await service.findOne(user, idNotExisting),
    ).rejects.toThrow(EntityNotFoundException);
  });

  // it('Update project', async () => {
  //   const user = { id: 1 } as User;
  //   const id = createdProject.id;
  //   const idNotExisting = 404;
  //   const dto = {
  //     color: '#0000000',
  //   } as UpdateProjectDto;

  //   expect(await service.update(user, id, dto)).toEqual(createdProject);
  //   expect(
  //     async () => await service.update(user, idNotExisting, dto),
  //   ).rejects.toThrow(EntityNotFoundException);
  // });
});
