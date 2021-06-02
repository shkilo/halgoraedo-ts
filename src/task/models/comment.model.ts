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

@Table({ tableName: 'comment' })
export class Comment extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @AllowNull(false)
  @Column
  content: string;

  @ForeignKey(() => Task)
  @Column
  taskId: string;

  @BelongsTo(() => Task)
  task: Task;
}
