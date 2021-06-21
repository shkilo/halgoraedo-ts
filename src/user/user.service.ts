import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { Project } from '../project/models/project.model';
import { ProjectService } from '../project/project.service';
import { defaultProjectTitle } from '../common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly projectService: ProjectService,
  ) {}

  async findOne(key: string, option: { by: 'id' | 'email' }): Promise<User> {
    return option.by === 'id'
      ? await this.userModel.findByPk(key)
      : await this.userModel.findOne({
          where: {
            email: key,
          },
        });
  }

  async findOrCreate(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(userData.email, { by: 'email' });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await this.userModel.create(userData);
    await this.projectService.create(newUser, { title: defaultProjectTitle });
    return newUser;
  }
}
