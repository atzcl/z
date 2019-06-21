/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| service 基类
|
*/

import * as dayjs from 'dayjs';
import { isString } from 'lodash';
import { BaseModel } from './Model/BaseModel';
import { BaseRequest } from './BaseRequest';
import { FindOptions } from 'sequelize/types';

export class Service extends BaseRequest {
  /**
   * 为了能够智能提示，先这样实现吧
   */
  get model() {
    return BaseModel;
  }

  /**
   * 处理分页
   *
   * @param model
   * @param {string} pageSizeColumn 当前查询条数字段参数名称（前端提交的参数）
   * @param {string} currentPage 当前页码字段参数名称（前端提交的参数）
   */
  public handlePaginate(currentPage = 'current_page', pageSizeColumn = 'page_size') {
    // 检测 model 数据存在
    this.detectionModel();

    const current = this.getRequest(currentPage, 1);
    // 单次最大查询次数
    const maxLimit = 100;
    // 获取查询条数
    const limit = this.getRequest(pageSizeColumn, 15); // todo: 后面抽离到 config 配置中

    // 添加分页条件
    this.model.page(current, limit > maxLimit ? maxLimit : limit);
  }

  /**
   * 动态处理排序
   *
   * @param fields 允许排序的字段集合
   */
  public handleSort(fields: string[] = [ 'order', 'created_at' ]) {
    // 检测 model 数据存在
    this.detectionModel();

    const order = this.getRequest('order', '');
    if (order && isString(order)) {
      // 是否是以 _asc 或者 _desc 结尾
      const pregMatch = order.match(/^(.+)_(asc|desc)$/);
      if (! pregMatch || ! pregMatch[1] || ! pregMatch[2] || fields.includes(pregMatch[0])) {
        return;
      }

      // 如果字符串的开头是这 2 个字符串之一，说明是一个合法的排序值
      // 根据传入的排序值来构造排序参数
      this.model.orderBy(pregMatch[1], pregMatch[2].toUpperCase() as any);
    } else if (fields.includes('created_at')) {
      // 默认以创建时间进行降序排序
      this.model.orderBy('created_at', 'DESC');
    }
  }

  /**
   * 动态时间区间查询
   *
   * @param string column
   */
  public handleTimeBetween(columns = 'created_at') {
    // 检测 model 数据存在
    this.detectionModel();

    const times = this.getRequest('time_between', []);
    if (times && Array.isArray(times) && times.length === 2) {
      const format = 'YYYY-MM-DD';

      // 储存时间区间值到 query 条件中
      this.model.whereBetween(
        columns,
        [
          dayjs(times[0].replace(/"/g, '')).format(format) + ' 00:00:00',
          dayjs(times[1].replace(/"/g, '')).format(format) + ' 23:59:59',
        ],
      );
    }
  }

  /**
   * 动态查询关键词
   *
   * @param array columns
   */
  public handleLikeKeyword(columns: string[]) {
    // 检测 model 数据存在
    this.detectionModel();

    const keyword = this.getRequest('keyword');
    if (keyword) {
      const like = `%${keyword}%`;

      // 拼接 or 条件
      const orWheres = [];
      for (const column of columns) {
        orWheres.push([ column, 'like', like ]);
      }

      // 储存到 query 条件中
      this.model.orWhere(orWheres);
    }
  }

  // todo: 后面可以使用 minxins or 装饰器来创建一个 CURD 的 service common

  /**
   * 分页
   */
  async getPaginate() {
    this.handlePaginate();

    return this.model._findAndCountAll();
  }

  /**
   * 查询指定数据
   */
  async show(id: string, options?: FindOptions) {
    return this.model.where({ id })._findOne(options);
  }

  /**
   * 创建数据
   *
   * @param {object?} data 可选的创建数据
   */
  async store(data?: object) {
    return this.model._create(data || this.requestBody);
  }

  /**
   * 更新数据
   *
   * @param {string} id
   * @param {object?} data 可选的更新数据
   */
  async update(id: string, data?: object) {
    return this.model._updateById(data || this.requestBody, id);
  }

  /**
   * 删除数据
   *
   * @param {string} id
   * @param {boolean} isForce 是否真实删除
   */
  async delete(id: string, isForce = false) {
    // 判断是否是多个删除
    const ids = this.requestBody.ids;
    if (ids && Array.isArray(ids) && ids.length) {
      id = this.requestBody.ids;
    }

    // 判断是否需要真实删除
    const method = isForce ? '_forceDelete' : '_destroy';

    return this.model[method](id);
  }

  // 检测 model 数据存在
  private detectionModel() {
    if (! this.model) {
      this.abort(500, 'service 缺少 model 数据');
    }
  }
}
