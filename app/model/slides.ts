import { Application } from 'egg';
import BaseModel from './model';

export default function Slides (app: Application) {
  // const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'slides', {
  }, {
    // 开启软删除
    paranoid: true,
  });

  return modelSchema;
}
