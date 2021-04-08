import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { Project } from '../project/project.model';
import { InvalidOptionException } from '../common/exceptions/buisness.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findOne(
    key: number | string,
    option: { by: 'id' | 'email' },
  ): Promise<User> {
    if (
      (option.by === 'id' && typeof key === 'string') ||
      (option.by === 'email' && typeof key === 'number')
    ) {
      throw new InvalidOptionException();
    }

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

    return this.userModel.create(
      { ...userData, projects: [{}] },
      { include: [Project] },
    );
  }
}
