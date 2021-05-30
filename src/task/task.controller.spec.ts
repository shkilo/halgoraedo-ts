import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

const mockReq = {
  user: {
    id: 'uuid',
  },
} as Request;
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

describe('ProjectController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(() => newTask),
            findAll: jest.fn(() => testTasks),
            findOne: jest.fn(() => testTasks[0]),
            update: jest.fn(() => testTasks[0]),
            remove: jest.fn(() => null),
          },
        },
      ],
    }).compile();

    controller = await modRef.resolve(TaskController);
  });

  it('Create project', async () => {
    const dto = {
      title: 'test',
    } as any;
    expect(await controller.create(mockReq, dto)).toEqual(newTask);
  });
  it('Find all projects', async () => {
    expect(await controller.findAll(mockReq)).toEqual({ tasks: testTasks });
  });
  it('Find one project by id', async () => {
    expect(await controller.findOne(mockReq, testTasks[0].id)).toEqual(
      testTasks[0],
    );
  });
  it('Update project', async () => {
    const dto = {
      title: 'test',
    } as any;
    expect(await controller.update(mockReq, testTasks[0].id, dto)).toEqual(
      testTasks[0],
    );
  });
  it('Remove project', async () => {
    expect(await controller.remove(mockReq, testTasks[0].id)).toBeNull();
  });
});
