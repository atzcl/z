import { Application } from 'egg';
import BaseModel from './model';

export default function UserPasswordResets (app: Application) {
  const { STRING, DATE } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'user_password_resets', {
    email: {
      type: STRING(64),
      allowNull: false,
      comment: '邮箱地址',
    },
    token: {
      type: STRING(255),
      allowNull: false,
      comment: '验证 token',
    },
    created_at: DATE,
  }, {
    // 关闭自动维护更新时间戳
    updatedAt: false,
  });

  return modelSchema;
}
