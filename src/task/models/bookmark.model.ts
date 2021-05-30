import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';
import { Task } from './task.model';

@Table({ tableName: 'bookmark' })
export class Bookmark extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column
  title: string;

  @AllowNull(false)
  @Column
  url: string;

  @ForeignKey(() => Task)
  @Column
  taskId: string;

  @BelongsTo(() => Task)
  task: Task;
}
