import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectService } from '../project/project.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { defaultProjectTitle } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private projectService: ProjectService,
  ) {}

  async findOrCreate(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.provider = createUserDto.provider;

    const existingUser = await User.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await user.save();
    await this.projectService.create(newUser, { title: defaultProjectTitle });

    return newUser;
  }

  async findOne(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }
}
