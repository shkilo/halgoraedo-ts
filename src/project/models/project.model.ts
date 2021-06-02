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
import { defaultProjectTitle } from '../../common/constants';
import { User } from '../../user/user.model';

import Sequelize from 'sequelize';
import { Section } from './section.model';

@Table({ tableName: 'project' })
export class Project extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

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
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;

  @HasMany(() => Section)
  sections: Section[];
}
