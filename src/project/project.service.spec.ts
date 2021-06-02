import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProjectService } from './project.service';
import { Project } from './models/project.model';
import { User } from '../user/user.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { EntityNotFoundException } from '../common/exceptions/buisness.exception';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Sequelize } from 'sequelize';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

const user = { id: 'uuid' } as User;
const idNotExisting = '404';
const testProject = {
  id: 'uuid',
  title: '관리함',
  isList: true,
  isFavorite: false,
  color: '#000000',
  creatorId: 1,
  sections: [
    {
      id: 'uuid',
      title: '기본 섹션',
      color: null,
      position: 0,
      projectId: 1,
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
            create: jest.fn(() => testProject),
            findAll: jest.fn(() => [testProject]),
            findOne: jest.fn((option) =>
              option.where.id === testProject.id ? testProject : undefined,
            ),
            update: jest.fn(() => testProject),
          },
        },
        {
          provide: Sequelize,
          useValue: {},
        },
      ],
    }).compile();
    service = modRef.get(ProjectService);
  });

  it('Create project', async () => {
    const dto: CreateProjectDto = {
      title: '관리함',
      isList: true,
      isFavorite: false,
      color: '#000000',
    };
    expect(await service.create(user, dto)).toEqual(testProject);
  });
  it('Find all project', async () => {
    expect(await service.findAll(user)).toEqual([testProject]);
  });
  it('Find one project by id', async () => {
    const id = testProject.id;

    // id existing
    expect(await service.findOne(user, id)).toEqual(testProject);
    // id not existing
    await expect(service.findOne(user, idNotExisting)).rejects.toBeInstanceOf(
      EntityNotFoundException,
    );
  });
  it('Update a project', async () => {
    const id = testProject.id;
    const dto: UpdateProjectDto = {
      color: '#0000000',
    };
    const projectInstace: any = {
      update() {
        return testProject;
      },
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => projectInstace);
    expect(await service.update(user, id, dto)).toEqual(testProject);
  });
  it('Delete a project', async () => {
    const projectInstace: any = {
      destroy: jest.fn(() => undefined),
    };

    jest.spyOn(service, 'findOne').mockImplementation(() => projectInstace);
    expect(await service.remove(user, testProject.id)).toBeUndefined();
  });
  it('Add a section to a project', async () => {
    const dto: CreateSectionDto = {
      title: 'test',
    };
    const createdSection = 'section';
    const projectInstance: any = {
      sections: [{ position: 0 }, { position: 1 }, { position: 2 }],
      $create: jest.fn(() => createdSection),
    };
    const maxPosition = 2;

    jest.spyOn(service, 'findOne').mockImplementation(() => projectInstance);

    expect(await service.addSection(user, testProject.id, dto)).toBe(
      createdSection,
    );
    expect(projectInstance.$create).toBeCalledWith('section', {
      ...dto,
      position: maxPosition + 1,
    });
  });
  it('Find a section', async () => {
    const section = testProject.sections[0];

    expect(await service.findSection(user, testProject.id, section.id)).toBe(
      section,
    );

    await expect(
      service.findSection(user, testProject.id, idNotExisting),
    ).rejects.toBeInstanceOf(EntityNotFoundException);
  });
  it('Update a section', async () => {
    const dto: UpdateSectionDto = { title: 'update' };
    const updatedSection = { title: 'update' };
    const sectionInstance: any = {
      update: jest.fn(() => {
        return updatedSection;
      }),
    };

    jest
      .spyOn(service, 'findSection')
      .mockImplementation(() => sectionInstance);

    expect(await service.updateSection(user, testProject.id, 'uuid', dto)).toBe(
      updatedSection,
    );
  });
  it('Delete a section', async () => {
    const sectionInstance: any = {
      destroy: jest.fn(() => undefined),
    };

    jest
      .spyOn(service, 'findSection')
      .mockImplementation(() => sectionInstance);

    expect(
      await service.removeSection(user, testProject.id, 'uuid'),
    ).toBeUndefined();
  });
  // it('Update positions of task in a section', async () => {
  //   const dto: UpdateSectionDto = { title: 'update' };
  //   const updatedSection = { title: 'update' };
  //   const sectionInstance: any = {
  //     update: jest.fn(() => {
  //       return updatedSection;
  //     }),
  //   };

  //   jest
  //     .spyOn(service, 'findSection')
  //     .mockImplementation(() => sectionInstance);

  //   expect(await service.updateSection(user, testProject.id, 1, dto)).toBe(
  //     updatedSection,
  //   );
  // });
});
