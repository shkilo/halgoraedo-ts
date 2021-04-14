import {
  Column,
  Model,
  Table,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { defaultProjectTitle } from '../common/constants';
import { User } from '../user/user.model';
import { Section } from './section.model';

@Table
export class Project extends Model {
  @AllowNull(false)
  @Column({ defaultValue: defaultProjectTitle })
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
  sections: Section[];
}
