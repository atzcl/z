/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleAdminArticleCategory
|
*/

import { provide, inject } from 'midway';
import { Service } from '@app/foundations/Bases/BaseService';

import { ArticleCategoryModel } from '../../Models/ArticleCategory';

import { ArticleServiceFromAdmin, SERVICE_PROVIDE as Article_SERVICE_PROVIDE } from './Article';


// 在容器的 id 名称
export const SERVICE_PROVIDE = 'articleCategoryServiceFromAdmin';

@provide(SERVICE_PROVIDE)
export class ArticleCategoryServiceFromAdmin extends Service {
  @inject(Article_SERVICE_PROVIDE)
  articleService!: ArticleServiceFromAdmin

  model() {
    return ArticleCategoryModel;
  }

  async updateSort(ids: string[]) {
    const columns = ids.map((id, order) => ({ id, order }));

    return this.queryBuilder().updateBatch(columns, ['order']);
  }

  async isExistSub(id: string) {
    return this.queryBuilder()
      .where('parent_id', id)
      .field(['id'])
      .setRaw(true)
      .first();
  }

  // 确保能够删除指定分类
  async makeSureYouCanDelete(id: string) {
    // 判断是否存在文章
    const existsResult = await this.articleService.isExistsArticleByCategoryId(id);
    if (existsResult) {
      this.abort(403, '该分类正在被文章数据使用，请解绑关联的文章数据再进行删除');
    }

    const isExistSub = await this.isExistSub(id);
    if (isExistSub) {
      this.abort(403, '该分类还存在下级，请解绑所有下级再进行删除')
    }
  }
}
