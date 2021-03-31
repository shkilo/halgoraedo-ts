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
export class Section extends Model {
  @AllowNull(false)
  @Column({ defaultValue: '기본 섹션' })
  title: string;

  @Column({ defaultValue: 0 })
  position: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => Project)
  project: Project;

  @HasMany(() => Task)
  tasks: Task[];
}
