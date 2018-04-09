import { Application } from 'egg';
import BaseModel from './model';

export default function User (app: Application) {
  const { INTEGER, DATE, STRING, BOOLEAN } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'users', {
    name: {
      type: STRING(32),
      unique: true,
      allowNull: false,
      comment: '用户名',
    },
    email: {
      type: STRING(64),
      unique: true,
      allowNull: true,
      comment: '邮箱地址',
    },
    phone: {
      type: STRING(20),
      unique: true,
      allowNull: true,
      comment: '手机号码',
    },
    avatar: {
      type: STRING(150),
      allowNull: true,
      comment: '头像',
    },
    real_name: {
      type: STRING(30),
      allowNull: true,
      comment: '真实姓名',
    },
    signature: {
      type: STRING(255),
      allowNull: true,
      comment: '签名',
    },
    notify_count: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '消息通知个数',
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      comment: '用户状态: 1 正常； 0 禁用',
    },
    password: {
      type: STRING(255),
      allowNull: false,
    },
    last_actived_at: DATE, // 最后活跃时间
  }, {
    // 开启软删除
    paranoid: true,
    // 修改器
    setterMethods: {
      async password (value: any) {
        // 加密密码
        (this as any).setDataValue('password', await app.createBcrypt(value));
      },
    },
  });

  return modelSchema;
}
