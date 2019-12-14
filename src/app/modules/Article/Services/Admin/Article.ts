/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleAdminArticle
|
*/

import { provide } from 'midway';
import { Service } from '@app/foundations/Bases/BaseService';

import { ArticleModel } from '../../Models/Article';

// 在容器的 id 名称
export const SERVICE_PROVIDE = 'articleServiceFromAdmin';

@provide(SERVICE_PROVIDE)
export class ArticleServiceFromAdmin extends Service {
  model() {
    return ArticleModel;
  }

  /**
   * 判断是否存在指定分类的文章
   * @param categoryId
   */
  async isExistsArticleByCategoryId(categoryId: string) {
    return this.queryBuilder()
      .where('article_category_id', categoryId)
      .field(['id'])
      .setRaw(true)
      .first();
  }

  // 增加分类关联查询
  relatedCategory() {
    this.queryBuilder().scopes('relatedCategory');

    return this;
  }

  // 增加各种状态查询
  addStateQueryCondition(queryData: { [k: string]: any, }) {
    ['status', 'is_hot', 'is_top'].forEach((k) => {
      if (queryData[k]) {
        this.queryBuilder().where(k, queryData[k]);
      }
    })

    return this;
  }

  // 增加分类查询
  addCategoryQueryCondition(categoryId: string) {
    if (categoryId) {
      this.queryBuilder().where('article_category_id', categoryId);
    }

    return this;
  }
}
