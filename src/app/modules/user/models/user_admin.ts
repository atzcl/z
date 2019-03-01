import {
  DataType, Table, Model, Column,
} from 'sequelize-typescript';
import Helper from '@app/extend/helper';

const { STRING } = DataType;

@Table({
  modelName: 'user_admins',
})
export class UserAdminModel extends Model<UserAdminModel> {
  @Column({ type: STRING, primaryKey: true, unique: true })
  id: string;

  @Column({ unique: true, allowNull: true })
  username: string;

  @Column({ unique: true, allowNull: true })
  email: string;

  @Column({ unique: true, allowNull: true })
  phone: string;

  @Column
  get password(): string {
    return this.getDataValue('password');
  }
  set password(value: string) {
    this.setDataValue('password', Helper.createBcrypt(value));
  }

  @Column({ allowNull: true })
  name: string;

  @Column({ allowNull: true })
  nickname: string;

  @Column({ allowNull: true })
  avatar: string;

  @Column({ allowNull: true })
  bio: string;

  @Column({ defaultValue: 0 })
  sex: number;

  @Column({ allowNull: true })
  location: string;

  @Column({ allowNull: true })
  birthdate: string;

  @Column({ allowNull: true })
  emailVerifiedAt: string;

  @Column({ allowNull: true })
  phoneVerifiedAt: string;

  @Column({ allowNull: true })
  userLevelId: number;

  @Column({ allowNull: true })
  status: number;

  @Column({ allowNull: true })
  onlineStatus: number;

  @Column({ allowNull: true })
  userToken: string;
}
