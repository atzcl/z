/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleAdminArticleCategory
|
*/

import {
  controller, provide, inject, get, post, put, del,
} from 'midway';
import { Controller, getAdminRoute } from '@app/foundations/Bases/BaseController';
import { validate } from '@app/foundations/Decorators/Validate';

import { ArticleCategoryServiceFromAdmin, SERVICE_PROVIDE } from '../../Services/Admin/ArticleCategory';

import { CURD, Body, Param } from '@/app/foundations/Decorators';

@provide()
@controller(getAdminRoute('articles/categories'))
export class ArticleAdminArticleCategoryController extends Controller {
  @inject(SERVICE_PROVIDE)
  service!: ArticleCategoryServiceFromAdmin;

  @get('/')
  @CURD.paginate()
  // 交由前端处理
  // @CURD.paginate<any[]>(async (data, ctx) => ctx.helper.loopConvertOneDimensionalArrayIntoTree({ data, pid: 'root' }))
  async index() {
    this.service.queryBuilder().setRaw(true);
  }

  @post('/')
  @validate({
    name: { required: true, type: 'string' },
  })
  @CURD.store
  async store() {
    //
  }

  // 更新排序
  @put('/sort')
  @validate({
    ids: { required: true, type: 'array' },
  })
  async updateSort(@Body('ids') ids: string[]) {
    const result = await this.service.updateSort(ids);

    return this.setStatusData(result).succeed();
  }

  @put('/:id')
  @validate({
    name: { required: true, type: 'string' },
  })
  @CURD.update
  async update() {
    //
  }

  @del('/:id')
  @CURD.destroy
  async destroy(@Param('id') id: string) {
    // 确保能够删除
    await this.service.makeSureYouCanDelete(id);

    // makeSureYouCanDelete 用完
    this.service.addApplicationPlatformScope(this.getJwtUserClaims('application_platform_id'));
  }
}
