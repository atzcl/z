/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleAdminArticle
|
*/

import {
  controller, provide, inject, get, post, put, del,
} from 'midway';
import { Controller, getAdminRoute } from '@app/foundations/Bases/BaseController';
import { validate } from '@app/foundations/Decorators/Validate';

import { ArticleServiceFromAdmin, SERVICE_PROVIDE } from '../../Services/Admin/Article';

import { CURD, Body, Query } from '@/app/foundations/Decorators';


@provide()
@controller(getAdminRoute('articles'))
export class ArticleAdminArticleController extends Controller {
  @inject(SERVICE_PROVIDE)
  service!: ArticleServiceFromAdmin;

  @get('/')
  @CURD.paginate()
  async index(
    @Query('keyword') keyword: string,
    @Query('category_id') categoryId: string,
    @Query('time_between') timeBetween: string[],
  ) {
    this.service
      .relatedCategory()
      .addStateQueryCondition(this.request._query())
      .addCategoryQueryCondition(categoryId)
      .addKeywordQueryCondition(keyword, ['title'])
      .addSortQueryCondition('created_at_desc', ['created_at'])
      .addTimeBetweenQueryCondition(timeBetween)
  }

  @get('/:id')
  @CURD.show
  async show() {
    //
  }

  @post('/')
  @validate({
    title: {
      required: true, type: 'string', min: 2, max: 255,
    },
  })
  @CURD.store
  async store(@Body('body') body: string) {
    if (body === '<p></p>') {
      this.request.offsetUnset('body');
    }
  }

  @put('/:id')
  @validate({
    title: {
      required: true, type: 'string', min: 2, max: 255,
    },
  })
  @CURD.update
  async update() {
    //
  }

  @del('/:id')
  @CURD.destroy
  async destroy() {
    //
  }
}
