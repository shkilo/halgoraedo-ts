import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

const mockReq = {
  user: {
    id: 1,
  },
} as Request;

const testProject = {
  id: 1,
  title: 'test project',
  isList: true,
  color: '#FFFFFF',
  isFavorite: false,
  creatorId: 1,
};

describe('CatsController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn(() => testProject),
            findAll: jest.fn(() => [testProject]),
            findOne: jest.fn(() => testProject),
            update: jest.fn(() => testProject),
            remove: jest.fn(() => null),
          },
        },
      ],
    }).compile();

    controller = await modRef.resolve(ProjectController);
  });

  it('Create project', async () => {
    const dto: CreateProjectDto = {
      title: 'test',
      color: '#FFFFFF',
    };
    expect(await controller.create(mockReq, dto)).toEqual(testProject);
  });

  it('Find all projects', async () => {
    expect(await controller.findAll(mockReq)).toEqual([testProject]);
  });

  it('Find one project by id', async () => {
    const projectId = 1;
    expect(await controller.findOne(mockReq, projectId)).toEqual(testProject);
  });

  it('Update project', async () => {
    const projectId = 1;
    const dto: UpdateProjectDto = {
      title: 'test project',
    };
    expect(await controller.update(mockReq, projectId, dto)).toEqual(
      testProject,
    );
  });

  it('Remove project', async () => {
    const projectId = 1;
    expect(await controller.remove(mockReq, projectId)).toBeNull();
  });
});
