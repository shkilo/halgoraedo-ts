import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
  IsUUID,
  PrimaryKey,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';
import { Project } from './project.model';
import { Task } from '../../task/models/task.model';
import { defaultSectionTitle } from '../../common/constants';

@Table({ tableName: 'section' })
export class Section extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @AllowNull(false)
  @Column({ defaultValue: defaultSectionTitle })
  title: string;

  @Column({ defaultValue: 0 })
  position: number;

  @ForeignKey(() => Project)
  @Column
  projectId: string;

  @BelongsTo(() => Project)
  project: Project;

  @HasMany(() => Task)
  tasks: Task[];
}
