import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { User } from '../user/user.model';
import { Section } from './section.model';
import { Task } from '../task/task.model';
import { CreateProjectDto } from './dto/create-project.dto';

const testProject = {
  id: 1,
  title: '관리함',
  isList: true,
  isFavorite: false,
  color: '#000000',
  creatorId: 1,
};

describe('ProjectService', () => {
  let service: ProjectService;
  // let user: User;

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
              save: () => testProject,
            })),
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
    expect(await service.create(user, dto)).toEqual(testProject);
  });
});
