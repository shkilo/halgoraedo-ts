import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { User } from '../user/user.model';
import { Section } from './section.model';
import { Task } from '../task/task.model';
import { CreateProjectDto } from './dto/create-project.dto';

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
});
