import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserService } from '../src/user/user.service';
import { CreateProjectDto } from '../src/project/dto/create-project.dto';
import { UpdateProjectDto } from '../src/project/dto/update-project.dto';
import { CreateSectionDto } from '../src/project/dto/create-section.dto';
import { UpdateSectionDto } from '../src/project/dto/update-section.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const badToken = 'badtoken';

  let testProjectId: string; // assigned with first 'GET /project'
  let testSectionId: string; // assigned with first 'POST /project/:projectId:section'

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // assumes that user is sucessfully created and logged in.
    const userService: UserService = moduleFixture.get(UserService);
    const authService: AuthService = moduleFixture.get(AuthService);
    const user = await userService.findOrCreate({
      name: 'test',
      provider: 'test',
      email: 'test',
    });
    token = `Bearer ${authService.getJwtToken(user)}`;

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // get all project
  // when a user was created above, default project for the user should have been created
  describe('/project GET', () => {
    it('should return all projects', () => {
      return request(app.getHttpServer())
        .get('/project')
        .set('authorization', token)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          const numOfProjects = body.projectInfos.length;
          expect(numOfProjects).toBeGreaterThan(1);
          testProjectId = body.projectInfos[numOfProjects - 1].id;
        });
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .get('/project')
        .set('authorization', badToken)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  // get a project
  describe('/project/:id GET', () => {
    const idNotExisting = 'fc97403a-7c80-448c-9acb-23e3f049a68d';

    it('should return a project', () => {
      return request(app.getHttpServer())
        .get(`/project/${testProjectId}`)
        .set('authorization', token)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.project.id).toBe(testProjectId);
        });
    });
    it('404 for id not existing', () => {
      return request(app.getHttpServer())
        .get(`/project/${idNotExisting}`)
        .set('authorization', token)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .get(`/project/${testProjectId}`)
        .set('authorization', badToken)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  // create a project
  describe('/project POST', () => {
    const dto: CreateProjectDto = {
      title: 'test',
    };
    const dtoBadTitle = {
      title: 1,
    };
    it('should return created project with id', () => {
      return request(app.getHttpServer())
        .post('/project')
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.title).toBe(dto.title);
        });
    });
    it('400 for a bad request', () => {
      return request(app.getHttpServer())
        .post('/project')
        .set('authorization', token)
        .send(dtoBadTitle)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .post('/project')
        .set('authorization', badToken)
        .send(dtoBadTitle)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  // update a project
  describe('/project/:id PATCH', () => {
    const dto: UpdateProjectDto = {
      title: 'updated',
    };
    const dtoBadTitle = {
      title: 400,
    };
    const idNotExisting = 'fc97403a-7c80-448c-9acb-23e3f049a68d';

    it('should update a project', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.title).toBe(dto.title);
        });
    });
    it('400 for a bad request', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}`)
        .set('authorization', token)
        .send(dtoBadTitle)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}`)
        .set('authorization', badToken)
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('404 for id not existing', () => {
      return request(app.getHttpServer())
        .patch(`/project/${idNotExisting}`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // add section to a project
  describe('/project/:id/section POST', () => {
    const dto: CreateSectionDto = {
      title: 'new section',
    };
    const dtoBadTitle = {
      title: 400,
    };
    const idNotExisting = 'fc97403a-7c80-448c-9acb-23e3f049a68d';

    it('should add a section to the project', () => {
      return request(app.getHttpServer())
        .post(`/project/${testProjectId}/section`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.title).toBe(dto.title);
          testSectionId = body.id;
        });
    });
    it('400 for a bad request', () => {
      return request(app.getHttpServer())
        .post(`/project/${testProjectId}/section`)
        .set('authorization', token)
        .send(dtoBadTitle)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .post(`/project/${testProjectId}/section`)
        .set('authorization', badToken)
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('404 for project id not existing', () => {
      return request(app.getHttpServer())
        .post(`/project/${idNotExisting}/section`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // update a section
  describe('/project/:projectId/section/:sectionId PATCH', () => {
    const dto: UpdateSectionDto = {
      title: 'updated',
    };
    const dtoBadTitle = {
      title: 400,
    };
    const sectionIdNotExisting = 'fc97403a-7c80-448c-9acb-23e3f049a68d';

    it('should update a project', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}/section/${testSectionId}`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.title).toBe(dto.title);
        });
    });
    it('400 for a bad request', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}/section/${testSectionId}`)
        .set('authorization', token)
        .send(dtoBadTitle)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('401 for a bad token', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}/section/${testSectionId}`)
        .set('authorization', badToken)
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('404 for section id not existing', () => {
      return request(app.getHttpServer())
        .patch(`/project/${testProjectId}/section/${sectionIdNotExisting}`)
        .set('authorization', token)
        .send(dto)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
