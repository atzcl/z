import { Application } from 'egg';
import BaseModel from './model';

export default function Configs (app: Application) {
  // const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'configs', {
  }, {
    // 开启软删除
    paranoid: true,
  });

  return modelSchema;
}
