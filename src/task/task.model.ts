import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Section } from '../project/section.model';

@Table
export class Task extends Model {
  @AllowNull(false)
  @Column
  title: string;

  @Column
  dueDate: Date;

  @AllowNull(false)
  @Column
  position: number;

  @AllowNull(false)
  @Column({ defaultValue: false })
  isDone: boolean;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @ForeignKey(() => Section)
  @Column
  sectionId: number;

  @BelongsTo(() => Section)
  section: Section;

  @ForeignKey(() => Task)
  @Column
  parentId: number;

  @BelongsTo(() => Task, 'parentId')
  parentTask: Task;

  @HasMany(() => Task)
  childTasks: Task[];
}
