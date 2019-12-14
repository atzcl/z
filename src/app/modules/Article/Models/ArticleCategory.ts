/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleArticleCategoryModel
|
*/

import { Table, Column } from 'sequelize-typescript';
import { BaseModel, DefaultColumns } from '@app/foundations/ORM/Model';

import { DEFAULT_STATUS } from '@/app/constants/Global';

@Table({
  modelName: 'article_categories',
})
@DefaultColumns
export class ArticleCategoryModel extends BaseModel<ArticleCategoryModel> {
  @Column({ defaultValue: 'root', comment: '父级 id' })
  parent_id!: string;

  @Column({ allowNull: false, comment: '名称' })
  name!: string;

  @Column({ allowNull: true, comment: '描述' })
  description!: string;

  @Column({ allowNull: true, comment: '缩略图' })
  image!: string;

  @Column({ allowNull: true, comment: '路由路径' })
  route!: string;

  @Column({ allowNull: true, comment: 'seo 标题' })
  seo_title!: string;

  @Column({ allowNull: true, comment: 'seo 关键词' })
  seo_keywords!: string;

  @Column({ allowNull: true, comment: 'seo 描述' })
  seo_description!: string;

  @Column({ defaultValue: DEFAULT_STATUS.NORMAL })
  status!: number;

  @Column({ defaultValue: 0 })
  order!: number;
}
