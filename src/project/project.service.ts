import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.model';
import { Section } from './section.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,
  ) {}

  async create(
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const project = new Project();
    project.title = createProjectDto.title;
    project.isList = createProjectDto.isList;
    project.isFavorite = createProjectDto.isFavorite;

    const newProject: Project = await user.$create('project', project);

    const section = new Section();
    await newProject.$create('section', section);

    return newProject;
  }

  async findAll(): Promise<Project[]> {
    return await this.projectModel.findAll();
  }

  async findOne(id: string): Promise<Project> {
    return await this.projectModel.findOne({
      where: {
        id,
      },
    });
  }

  // async update(id: string): Promise<Project> {

  // }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
