import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Project } from './project.model';
import { Task } from '../task/task.model';

@Table
export class Section extends Model<Section> {
  @AllowNull(false)
  @Column
  title: string;

  @Column
  color: string;

  @Column
  position: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => Project)
  project: Project;

  @HasMany(() => Task)
  task: Task[];
}
