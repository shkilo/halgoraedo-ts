import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  IsUUID,
} from 'sequelize-typescript';
import { User } from '../../user/user.model';
import { Comment } from './comment.model';
import { Bookmark } from './bookmark.model';
import Sequelize from 'sequelize';
import { Section } from '../../project/models/section.model';

@Table({ tableName: 'task' })
export class Task extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

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

  @Column
  priority: 1 | 2 | 3 | 4;

  @ForeignKey(() => User)
  @Column
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;

  @ForeignKey(() => Section)
  @Column
  sectionId: string;

  @BelongsTo(() => Section)
  section: Section;

  @ForeignKey(() => Task)
  @Column
  parentId: string;

  @BelongsTo(() => Task, 'parentId')
  parentTask: Task;

  @HasMany(() => Task, 'parentId')
  tasks: Task[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];
}
