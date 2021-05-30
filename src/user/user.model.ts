import {
  Column,
  Model,
  Table,
  HasMany,
  Unique,
  IsUUID,
  PrimaryKey,
} from 'sequelize-typescript';
import { Project } from '../project/models/project.model';
import { Task } from '../task/models/task.model';
import Sequelize from 'sequelize';

@Table({ tableName: 'user' })
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Unique
  @Column
  email: string;

  @Column({ defaultValue: true })
  name: string;

  @Column
  provider: 'google' | 'apple' | 'facebook' | 'naver';

  @HasMany(() => Project)
  projects: Project[];

  @HasMany(() => Task)
  tasks: Task[];
}
