import { Column, Model, Table, HasMany, Unique } from 'sequelize-typescript';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';

@Table
export class User extends Model {
  @Unique
  @Column
  email: string;

  @Column({ defaultValue: true })
  name: string;

  @Column
  provider: string;

  @HasMany(() => Project)
  projects: Project[];

  @HasMany(() => Task)
  tasks: Task[];
}
