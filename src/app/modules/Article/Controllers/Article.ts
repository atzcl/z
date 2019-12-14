/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ArticleArticle
|
*/

import {
  controller, provide, inject, get, post, put, del,
} from 'midway';
import { Controller } from '@app/foundations/Bases/BaseController';

import { ArticleServiceFromAdmin } from '../Services/Admin/Article';

@provide()
@controller('/articles', { middleware: ['verifyJWTMiddleware'] as GlobalMiddlewareNames })
export class ArticleArticleController extends Controller {
  @inject('Service')
  service!: ArticleServiceFromAdmin;

  @get('/')
  async index() {
    const result = await this.service.paginate(this.request);

    return this.setStatusData(result.data).setStatusTotal(result.count).succeed();
  }

  @post('/')
  async store() {
    return this.setStatusData(await this.service.store(this.request)).succeed();
  }

  @put('/:id')
  async update() {
    return this.setStatusData(await this.service.update(this.ctx.params.id, this.request)).succeed();
  }

  @del('/:id')
  async destroy() {
    return this.setStatusData(await this.service.delete(this.ctx.params.id)).succeed();
  }
}
