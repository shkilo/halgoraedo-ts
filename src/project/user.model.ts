import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  email: string;

  @Column({ defaultValue: true })
  name: string;

  @Column
  provider: string;
}
