/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Active Record 模式
|
*/

import { isObject } from 'util';

import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';
import {
  WhereOptions,
  FindOptions,
  ProjectionAlias,
  FindAttributeOptions,
  FindAndCountOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  Includeable,
} from 'sequelize/types/lib/model';
import { isString, cloneDeep, isPlainObject } from 'lodash';

import { parserResult, isEmpty } from './Utils';

import { FormatTimestamp } from '@/app/foundation/Decorators/Model/FormatTimestamp';


export { FormatTimestamp };

const operatorTypes = {
  and: Op.and,
  or: Op.or,

  '=': Op.eq,
  '<>': Op.ne,
  '>': Op.gt,
  '>=': Op.gte,
  '<': Op.lt,
  '<=': Op.lte,

  eq: Op.eq,
  ne: Op.ne,
  gt: Op.gt,
  gte: Op.gte,
  lt: Op.lt,
  lte: Op.lte,

  in: Op.in,
  'not in': Op.notIn,
  like: Op.like,
  'not like': Op.notLike,
  between: Op.between,
  'not between': Op.notBetween,
};

type OperatorTypeOfKeys = keyof typeof operatorTypes;

/**
 * 获取查询类型
 *
 * @param {OperatorTypeOfKeys} type
 *
 * @return {symbol}
 */
export const getOperatorType = (type: OperatorTypeOfKeys) => operatorTypes[type] || null;

export class BaseModel<T = any> extends Model<T> {
  // 是否使用隐藏
  static isUseHidden = false;

  /**
   * @param {string[]} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  static hidden: string[] = [];

  // 临时值，优先级比 hidden 高
  static tempHidden: string[] = [];

  static isUseVisible = false;

  /**
   * @param {array} 输出数据时显示的属性 [ 白名单 ]
   */
  static visible: string[] = [];

  // 临时值，优先级比 visible 高
  static tempVisible: string[] = [];

  /**
   * @param {object} 序列化字段类型
   */
  static casts = {};

  /**
   * sequelize、typeorm 这类 orm 会根据定义的 column 来做底层的过滤的, 所以这里其实是可以去掉的了
   *
   * @returns {string[]} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  static fillable: string[] = [];

  static bindings: FindOptions = {
    // 查询条件
    where: {},
    // 查询偏移量
    offset: undefined,
    // 限制查询条数
    limit: undefined,
    // 分组属性
    group: undefined,
    // 排序方式
    order: [],
    // 限制字段查询
    attributes: [],
    // 关联查询
    include: [],
    // 是否获取原始数据, 反之会为搜索出的每一条数据生成一个对应 model 的实例，用于更新，删除等操作
    raw: false,
  };

  /**
   * 因为都使用了 static 静态属性来储存，所以在本次操作结束后，需要将当前 model 的相关属性值初始化一下
   */
  static resetModel() {
    this.bindings = {
      where: {},
      offset: undefined,
      limit: undefined,
      group: undefined,
      order: [],
      attributes: [],
      include: [],
      raw: false,
    };

    // 重置 hidden 相关
    this.isUseHidden = false;
    this.tempHidden = [];

    // 重置 visible 相关
    this.isUseVisible = false;
    this.tempVisible = [];
  }

  // 使用 hidden 处理
  static useHidden(hiddens?: string[]) {
    if (hiddens && hiddens.length) {
      this.isUseHidden = true;

      this.tempHidden = hiddens;
    }

    return this;
  }

  // 使用 visible 处理
  static useVisible(visibles?: string[]) {
    if (visibles && visibles.length) {
      this.isUseVisible = true;

      this.tempVisible = visibles;
    }

    return this;
  }

  /**
   * 设置查询的 model attributes
   *
   * @see https://demopark.github.io/sequelize-docs-Zh-CN/querying.html
   *
   * @param {FindAttributeOptions} attributes
   */
  static setAttributes(attributes: FindAttributeOptions) {
    this.bindings.attributes = attributes;

    return this;
  }

  /**
   * 查询指定字段
   *
   * @param {Array<string | ProjectionAlias>} attributes
   */
  static field(attributes: Array<string | ProjectionAlias>) {
    return this.setAttributes(attributes);
  }

  /**
   * 字段排除
   *
   * @param {string[]} attributes
   */
  static fieldExclude(attributes: string[]) {
    return this.setAttributes({ exclude: attributes });
  }

  /**
   * 设置分组属性
   *
   * @param {FindOptions['group']} group
   */
  static setGroup(group: FindOptions['group']) {
    this.bindings.group = group;

    return this;
  }

  /**
   * 设置关联查询
   *
   * @param {FindOptions['include']} include
   */
  static setInclude(include: Includeable | Includeable[]) {
    if (this.bindings.include) {
      this.bindings.include = this.bindings.include.concat(include);
    }

    return this;
  }

  /**
   * 设置是否获取原始数据
   *
   * @param {boolean} raw
   */
  static setRaw(raw: boolean) {
    this.bindings.raw = raw;

    return this;
  }

  /**
   * 链式设置 offset 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  static offset(num: number) {
    this.bindings.offset = Number(num);

    return this;
  }

  /**
   * 链式设置 limit 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  static limit(num: number) {
    this.bindings.limit = Number(num);

    return this;
  }

  /**
   * 链式设置 offset、limit 值
   *
   * @param {number} offset
   * @param {number} limit
   *
   * @returns {this}
   */
  static page(offset: number, limit: number) {
    return this.offset(offset - 1).limit(limit);
  }

  /**
   * 链式设置 order 值
   *
   * @param {string} column 字段名称
   * @param {'DESC' | 'ASC'} values 排序值
   *
   * @returns {this}
   */
  static orderBy(column: string, values: 'DESC' | 'ASC') {
    this.bindings.order = [ [column, values] ];

    return this;
  }

  /**
   * 快捷设置升序排序
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  static oldest(column = 'created_at') {
    return this.orderBy(column, 'ASC');
  }

  /**
   * 快捷设置降序排序
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  static latest(column = 'created_at') {
    return this.orderBy(column, 'DESC');
  }

  /**
   * 链式设置 where 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  static where(where: WhereOptions) {
    this.bindings.where = {
      ...this.bindings.where,
      ...where,
    };

    return this;
  }

  /**
   * 链式设置 where or 条件
   *
   * @param {string | any[]} column 字段名称
   * @param {any[]} values 查询值
   *
   * @returns {this}
   */
  static orWhere(
    column: string | any[],
    operator?: OperatorTypeOfKeys | any[],
    values?: string | boolean | number | any[],
  ) {
    /**
     *  @desc or 有两种形式:
     *   Post.findAll({
     *       where: {
     *         authorId: {
     *          [Op.or]: [12, 13]
     *        }
     *    });
     *    SELECT * FROM post WHERE authorId = 12 AND status = 'active';
     *
     *    Post.findAll({
     *      where: {
     *        [Op.or]: [{authorId: 12}, {authorId: 13}]
     *     }
     *   });
     *   SELECT * FROM post WHERE authorId = 12 OR authorId = 13;
     *
     *  为了符合 laravel 的使用习惯，这样转一下
     */

    const getOperator = getOperatorType(operator as any);

    /**
     * @desc 第一种用法: orWhere('authorId', 'ne', 12)
     */
    if (isString(column) && isString(operator) && getOperator && values && ! Array.isArray(values)) {
      return this.where({
        [Op.or]: [
          {
            [column]: {
              [getOperator]: values,
            },
          },
        ],
      });
    }

    /**
     * @desc 第二种用法: orWhere('authorId', 12)
     */
    if (isString(column) && ! getOperator) {
      return this.where({
        [Op.or]: [ { [column]: operator } ],
      });
    }

    /**
     * @desc 第三种用法:
     *   1: [ { authorId: 12 }, { authorId: 13 }]
     *   2: [ [ 'authorId', '=', 12 ], [ 'authorId', '=', 13 ] ]
     */
    if (Array.isArray(column)) {
      const realQueryParams = [];
      for (const col of column) {
        if (Array.isArray(col) && col.length === 3 && getOperatorType(col[1])) {
          // 拼接为，例： { authorId: { [Op.eq]: 12 } }
          realQueryParams.push({ [col[0]]: { [getOperatorType(col[1])]: col[2] } });
        } else {
          realQueryParams.push(col);
        }
      }

      return this.where({ [Op.or]: realQueryParams });
    }
  }

  /**
   * 链式设置 where null 条件
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  static whereNull(column: string) {
    return this.where({
      [column]: {
        [Op.eq]: null,
      },
    });
  }

  /**
   * 链式设置 where not null 条件
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  static whereNotNull(column: string) {
    return this.where({
      [column]: {
        [Op.ne]: null,
      },
    } as any);
  }

  /**
   * 链式设置 where not null string 条件 (不等于空字符)
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  static whereNotNullString(column: string) {
    return this.where({
      [column]: {
        [Op.ne]: '',
      },
    });
  }

  /**
   * 链式设置 where between 条件
   *
   * @param {string} column 字段名称
   * @param {any[]} values 查询值
   *
   * @returns {this}
   */
  static whereBetween(column: string, values: any[]) {
    return this.where({
      [column]: {
        [Op.between]: values,
      },
    } as any);
  }

  /**
   * 链式设置 where notBetween 条件
   *
   * @param {string} column 字段名称
   * @param {any[]} values 查询值
   *
   * @returns {this}
   */
  static whereNotBetween(column: string, values: any[]) {
    return this.where({
      [column]: {
        [Op.notBetween]: values,
      },
    } as any);
  }

  /**
   * 链式设置 where like 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  static whereLike(column: string, values: string) {
    return this.where({
      [column]: {
        [Op.like]: values,
      },
    });
  }

  /**
   * 链式设置 where like 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  static whereNotLike(column: string, values: string) {
    return this.where({
      [column]: {
        [Op.notLike]: values,
      },
    });
  }

  /**
   * 链式设置 where in 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  static whereIn(column: string, values: Array<string | number>) {
    return this.where({
      [column]: {
        [Op.in]: values,
      },
    });
  }

  /**
   * 链式设置 where notIn 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  static whereNotIn(column: string, values: Array<string | number>) {
    return this.where({
      [column]: {
        [Op.notIn]: values,
      },
    });
  }

  /**
   * 解析查询参数
   *
   * @param {FindOptions} options
   */
  static resolveQueryOptions(options: any = {}): any {
    const {
      where, offset, limit, order, group, include, raw, attributes,
    } = this.bindings;

    const hasOwnProperty = (property: string) => Object.prototype.hasOwnProperty.call(options, property);

    // 合并 where
    // 使用 Symbol 作为 object 字面量时，Symbol 为不可枚举属性
    if (hasOwnProperty('where') || Reflect.ownKeys(where || {}).length) {
      options.where = { ...options.where || {}, ...where };
    }

    // offset 偏移条件
    if (! hasOwnProperty('offset') && ! isEmpty(offset)) {
      options.offset = this.offset;
    }

    // limit 限制条件
    if (! hasOwnProperty('limit') && ! isEmpty(limit)) {
      options.limit = this.limit;
    }

    // order 排序条件
    if (options.order && Array.isArray(options.order) || (order as string[]).length) {
      options.order = [...(order as string[]), ...options.order || []];
    }

    // 分组查询
    if (! options.group && group) {
      options.group = group;
    }

    // 关联查询
    if (! options.include && (include as any[]).length) {
      options.include = include;
    }

    // 原始查询
    if (options.raw === undefined) {
      options.raw = raw;
    }

    /**
     * 因为 attributes 的用法太多，所以不做合并区分，直接替换
     *
     * @see https://demopark.github.io/sequelize-docs-Zh-CN/querying.html
     */
    if (
      Array.isArray(attributes) && attributes.length
      || isObject(attributes) && Object.keys(attributes as object).length
    ) {
      options.attributes = attributes;
    }

    // 拷贝一份解析结果，然后传递使用，避免污染
    const cloneDeepOptions = cloneDeep({
      ...options,
      isUseHidden: this.isUseHidden,
      tempHidden: this.tempHidden,
      isUseVisible: this.isUseVisible,
      tempVisible: this.tempVisible,
    });

    // 解析完后就重置，比如污染后续操作
    this.resetModel();

    return cloneDeepOptions;
  }

  /**
   * 查询单条数据
   */
  static _findOne(options?: FindOptions): Promise<any> {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper(
      this.findOne(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询全部数据
   */
  static _findAll(options?: FindOptions): Promise<any> {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper(
      this.findAll(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询所有数据，并计算当前表的总数
   */
  static _findAndCountAll(options?: FindAndCountOptions): Promise<any> {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper(
      this.findAndCountAll(resolveOptions),
      resolveOptions,
      ({ count, rows }) => { return { count, data: rows } }, // 自定义成功回调, 只返回总记录数、具体的数据列表
    );
  }

  /**
   * 创建数据
   */
  static _create(values: object, options?: CreateOptions) {
    // 判断传入的是否是普通的 object 对象
    if (! isPlainObject(values)) {
      throw new Error('【Model】create 传入的 value 不合法');
    }

    if ((! options || ! options.fields) && this.fillable.length) {
      if (! options) {
        options = {};
      }

      options.fields = this.fillable;
    }

    // 删除可能存在的 id
    if (Object.prototype.hasOwnProperty.call(values, this.primaryKeyAttribute)) {
      delete (values as any)[this.primaryKeyAttribute as any];
    }

    return this._executeWrapper(
      this.create(values, options),
      options || {},
    );
  }

  /**
   * 更新数据
   */
  static _update(values: object, options: UpdateOptions) {
    if (! options.fields && this.fillable.length) {
      options.fields = this.fillable;
    }

    this.useHidden(['updated_at', 'created_at']);

    const resolveOptions = this.resolveQueryOptions(options);

    delete (values as any).id;

    return this._executeWrapper(
      this.update(values, resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 用主键作为更新条件
   */
  static _updateById(values: object, id: string | number) {
    return this._update(values, { where: { [this.primaryKeyAttribute]: id } })
      .then((res: any) => res[0] || null);
  }

  /**
   * 删除 or 软删除
   */
  static _destroy(id: string | number | Array<string | number>, options?: DestroyOptions) {
    if (Array.isArray(id)) {
      // 多个删除
      this.whereIn(this.primaryKeyAttribute, id);
    } else {
      // 单个删除
      this.where({ [this.primaryKeyAttribute]: id });
    }

    const resolveOptions = this.resolveQueryOptions(options || {});

    return this._executeWrapper(
      this.destroy(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 真实删除
   */
  static _forceDelete(id: string | number | Array<string | number>) {
    return this._destroy(id, { force: true });
  }

  /**
   * 包装一下执行的方法，减少样板代码
   */
  static _executeWrapper(executeFunction: Promise<any>, resolveOptions: object, thenCallback?: (result: any) => any) {
    return new Promise((resolve, reject) => {
      executeFunction
        .then((result) => {
          // 解析数据
          const modelResult = parserResult(result, resolveOptions as any);

          /**
           * 处理成功回调
           *
           * 这里注意一下，因为 sequelize 的返回是分两种的：
           *  1: raw = false, 返回整个 model 实例, 然后 ctx.body 返回的时候，对 model 的数据进行 JSON.stringify 的时候，
           *    会遍历整个 model class，这时候会执行 model 的 getter, 导致 hidden 无效，所以这里判断一下状态
           *    然后直接返回 model 的 dataValues
           *
           *  2: raw = true, 返回原始查询数据
           */
          resolve(
            thenCallback ? thenCallback(modelResult) : modelResult,
          );
        })
        .catch(err => reject(err));
    });
  }
}
