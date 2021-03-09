import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Section } from '../project/section.model';

@Table
export class Task extends Model<Task> {
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
}
