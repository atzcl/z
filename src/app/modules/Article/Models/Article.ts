/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleArticleModel
|
*/

import { DataType, Table, Column, BelongsTo } from 'sequelize-typescript';
import { BaseModel, DefaultColumns, FormatTimestamp } from '@app/foundations/ORM/Model';

import { ArticleCategoryModel } from './ArticleCategory';

import { DEFAULT_STATUS } from '@/app/constants/Global';
import { Scopes } from '@/app/foundations/Decorators';
import { filterXSSInHtml } from '@/app/foundations/XSS';


const { STRING, JSON } = DataType;

@Scopes(
  [],
  {
    // 关联文章分类作用域
    relatedCategory: {
      include: [{ model: ArticleCategoryModel, attributes: ['id', 'name'] }],
    },
  },
)
@Table({
  modelName: 'articles',
})
@DefaultColumns
export class ArticleModel extends BaseModel<ArticleModel> {
  @Column
  title!: string;

  @Column({ allowNull: true })
  description!: string;

  @Column({ allowNull: true })
  slug!: string;

  @Column({ allowNull: true })
  image!: string;

  @Column({ type: JSON })
  images!: string;

  @Column({ type: STRING })
  set body(value: string) {
    // xss 过滤
    this.setDataValue('body', filterXSSInHtml(value));
  }

  @BelongsTo(() => ArticleCategoryModel, 'article_category_id')
  category_info!: ArticleCategoryModel;

  @Column({ defaultValue: 0, comment: '查看总数, 可自定义, 在界面上显示的是 view_count + real_view_count' })
  view_count!: number;

  @Column({ defaultValue: 0, comment: '查看总数, 真实的' })
  real_view_count!: number;

  @Column({ defaultValue: 0, comment: '回复总数' })
  reply_count!: number;

  @Column({ allowNull: true, comment: '最后回复的用户 id' })
  last_reply_user_id!: string;

  @Column({ allowNull: true })
  author!: string;

  @Column({ allowNull: true })
  source!: string;

  @Column({ defaultValue: DEFAULT_STATUS.NORMAL })
  status!: number;

  @Column({ defaultValue: DEFAULT_STATUS.DISABLE })
  is_top!: number;

  @Column({ defaultValue: DEFAULT_STATUS.DISABLE })
  is_hot!: number;

  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ allowNull: true, comment: '定时发布' })
  @FormatTimestamp
  timed_release!: Date;

  @Column({ allowNull: true, comment: 'seo 标题' })
  seo_title!: string;

  @Column({ allowNull: true, comment: 'seo 关键词' })
  seo_keywords!: string;

  @Column({ allowNull: true, comment: 'seo 描述' })
  seo_description!: string;
}
