import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { ProjectService } from '../project/project.service';
import { Task } from './models/task.model';
import { TaskService } from './task.service';
import { Sequelize } from 'sequelize';
const testTasks = [
  {
    id: 'uuid1',
    position: 0,
  },
  {
    id: 'uuid2',
    position: 1,
  },
];
const newTask = {
  id: 'uuid3',
  title: 'test',
  position: 2,
};
const testSection = {
  tasks: [
    { id: 'uuid1', title: 'test1' },
    { id: 'uuid2', title: 'test2' },
  ],
};
const user = { id: 'uuid' } as any;

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: Sequelize,
          useValue: {},
        },
        {
          provide: ProjectService,
          useValue: {
            findSection: jest.fn(() => testSection),
          },
        },
        {
          provide: getModelToken(Task),
          useValue: {
            create: jest.fn(() => newTask),
            findAll: jest.fn(() => testTasks),
            findOne: jest.fn((option) =>
              option.where.id === testTasks[0].id ? testTasks[0] : undefined,
            ),
          },
        },
      ],
    }).compile();
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Create a task', async () => {
    const dto = {
      title: 'test',
      projectId: 'uuid',
      sectionId: 'uuid',
    } as any;
    expect(await service.create(user, dto)).toEqual(newTask);
  });
  it('Find all tasks', async () => {
    expect(await service.findAll(user)).toEqual(testTasks);
  });
  it('Find one task by id', async () => {
    const id = testTasks[0].id;
    const idNotExisting = '404';
    // id existing
    expect(await service.findOne(user, id)).toEqual(testTasks[0]);
    // id not existing
    await expect(service.findOne(user, idNotExisting)).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });
  it('Update a task', async () => {
    const id = testTasks[0].id;
    const dto = {
      title: 'new title',
    } as any;
    const taskInstace: any = {
      update() {
        return testTasks[0];
      },
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => taskInstace);
    expect(await service.update(user, id, dto)).toEqual(testTasks[0]);
  });
  it('Delete a task', async () => {
    const taskInstace: any = {
      destroy: jest.fn(() => undefined),
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => taskInstace);
    expect(await service.remove(user, testTasks[0].id)).toBeUndefined();
  });
});
