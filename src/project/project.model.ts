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
import { Section } from './section.model';

@Table
export class Project extends Model<Project> {
  @AllowNull(false)
  @Column
  title: string;

  @Column
  color: string;

  @AllowNull(false)
  @Column({ defaultValue: true })
  isList: boolean;

  @Column({ defaultValue: false })
  isFavorite: boolean;

  @ForeignKey(() => User)
  @Column
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Section)
  section: Section[];
}
