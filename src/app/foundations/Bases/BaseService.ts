/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| service 基类
|
*/

import * as dayjs from 'dayjs';
import { isString } from 'lodash';
import { FindOptions } from 'sequelize/types';
import { AppFlowException } from '@app/exceptions/AppFlowException';

import { UserApplicationPlatformScopes } from '../ORM/Decorators/Scopes/ApplicationPlatformIdScope';
import { BaseModel, BuildsQueries } from '../ORM/Model';

import { BaseRequest } from './BaseRequest';


type IRequest = typeof BaseRequest.prototype.request;

export abstract class Service {
  /**
   * 查询构造器实例
   *
   * @description 需要注意作用域问题，避免属性被污染 https://midwayjs.org/midway/ioc.html#%E9%85%8D%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F
   */
  protected queryBuilderInstance?: BuildsQueries;

  /**
   * 为了能够智能提示，先这样实现吧
   */
  abstract model(): typeof BaseModel

  /**
   * 创建查询构造器
   */
  makeQueryBuilder(): BuildsQueries {
    this.queryBuilderInstance = new BuildsQueries(this.model());

    return this.queryBuilderInstance;
  }

  /**
   * 获取查询构造器
   */
  queryBuilder(): BuildsQueries {
    return this.queryBuilderInstance || this.makeQueryBuilder();
  }

  /**
   * 处理分页
   *
   * @param {IRequest} request 封装过的请求对象
   * @param {string} pageSizeColumn 当前查询条数字段参数名称（前端提交的参数）
   * @param {string} currentPage 当前页码字段参数名称（前端提交的参数）
   */
  addPaginateQueryCondition(
    request: IRequest,
    currentPageField = 'current',
    pageSizeField = 'pageSize',
  ) {
    const current = request._query(currentPageField, 1);

    // 单次最大查询次数
    const maxLimit = 100;
    // 获取查询条数
    const limit = request._query(pageSizeField, 15); // todo: 后面抽离到 config 配置中

    // 添加分页条件
    this.queryBuilder().page(current, limit > maxLimit ? maxLimit : limit);

    return this;
  }

  /**
   * 动态处理排序
   *
   * @param {string} order 排序值
   * @param {string} fields 允许排序的字段集合
   */
  addSortQueryCondition(
    order: string,
    fields: string[] = ['order', 'created_at'],
  ) {
    if (order && isString(order)) {
      // 是否是以 _asc 或者 _desc 结尾
      const pregMatch = order.match(/^(.+)_(asc|desc)$/u);
      if (! pregMatch || ! pregMatch[1] || ! pregMatch[2] || ! fields.includes(pregMatch[0])) {
        return this;
      }

      // 如果字符串的开头是这 2 个字符串之一，说明是一个合法的排序值
      // 根据传入的排序值来构造排序参数
      this.queryBuilder().orderBy(pregMatch[1], pregMatch[2].toUpperCase() as any);
    } else if (fields.includes('created_at')) {
      // 默认以创建时间进行降序排序
      this.queryBuilder().orderBy('created_at', 'DESC');
    }

    return this;
  }

  /**
   * 动态时间区间查询
   *
   * @param {BuildsQueries} builder 查询类
   * @param {Array<string | number>} timeBetween 查询的时间区间
   * @param {string} column 查询字段
   */
  addTimeBetweenQueryCondition(
    timeBetween: (string | number)[],
    columns = 'created_at',
  ) {
    if (timeBetween) {
      const times = timeBetween;
      if (times && Array.isArray(times) && times.length === 2) {
        const format = 'YYYY-MM-DD';

        // 储存时间区间值到 query 条件中
        this.queryBuilder().whereBetween(
          columns,
          [
            dayjs(String(times[0]).replace(/"/ug, '')).format(format) + ' 00:00:00',
            dayjs(String(times[1]).replace(/"/ug, '')).format(format) + ' 23:59:59',
          ],
        );
      }
    }

    return this;
  }

  /**
   * 动态查询关键词
   *
   * @param {BuildsQueries} builder 查询类
   * @param {array} columns 查询字段集合
   */
  addKeywordQueryCondition(
    keyword: string,
    columns: string[],
  ) {
    if (keyword) {
      const like = `%${String(keyword)}%`;

      // 拼接 or 条件
      const orWheres = [];
      for (const column of columns) {
        orWheres.push([column, 'like', like]);
      }

      // 储存到 query 条件中
      this.queryBuilder().orWhere(orWheres);
    }

    return this;
  }

  /**
   * 增加关联所属应用平台的查询作用域
   *
   * @param {string} id 所属应用平台 id
   */
  addApplicationPlatformScope(id: string) {
    this.queryBuilder().scopes(UserApplicationPlatformScopes.where, id);

    return this;
  }

  /**
   * 增加关联所属应用平台的 [or] 查询作用域
   *
   * @param {string} id 所属应用平台 id
   */
  addOrWhereApplicationPlatformScope(id: string) {
    this.queryBuilder().scopes(UserApplicationPlatformScopes.orWhere, id);

    return this;
  }

  // todo: 后面可以使用 minxins or 装饰器来创建一个 CURD 的 service common

  /**
   * 分页
   *
   * @param {BuildsQueries} builder 查询类
   * @param {IRequest} request 封装过的请求对象
   * @param {string} pageSizeColumn 当前查询条数字段参数名称（前端提交的参数）
   * @param {string} currentPage 当前页码字段参数名称（前端提交的参数）
   */
  async paginate(request: IRequest, currentPageField = 'current', pageSizeField = 'pageSize') {
    this.addPaginateQueryCondition(request, currentPageField, pageSizeField);

    return this.queryBuilder().findAndCountAll();
  }

  /**
   * 查询指定数据
   */
  async show(id: string, options?: FindOptions) {
    return this.queryBuilder().where({ id }).first(options);
  }

  /**
   * 创建数据
   *
   * @param {object} data 可选的创建数据
   */
  async store(data: object) {
    return this.queryBuilder().create(data);
  }

  /**
   * 更新数据
   *
   * @param {string} id
   * @param {object} data 可选的更新数据
   */
  async update(id: string, data: object) {
    return this.queryBuilder().updateById(data, id);
  }

  /**
   * 删除数据
   *
   * @param {string | string[]} id 单个 id OR id 集合
   * @param {boolean} isForce 是否真实删除
   */
  async delete(id: string | string[], isForce = false) {
    // 判断是否需要真实删除
    return isForce ? this.queryBuilder().forceDelete(id) : this.queryBuilder().destroy(id);
  }

  // 抛出异常
  abort(code: number, message = 'error') {
    throw new AppFlowException(message, code);
  }
}
