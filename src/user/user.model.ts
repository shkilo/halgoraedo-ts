import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';

@Table
export class User extends Model<User> {
  @Column
  email: string;

  @Column({ defaultValue: true })
  name: string;

  @Column
  provider: string;

  @HasMany(() => Project)
  project: Project[];

  @HasMany(() => Task)
  task: Task[];
}
