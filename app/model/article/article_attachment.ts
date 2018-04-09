import { Application } from 'egg';
import BaseModel from '../model';

export default function ArticleAttachment (app: Application) {
  // const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'article_attachments', {
  }, {
    // 开启软删除
    paranoid: true,
  });

  return modelSchema;
}
