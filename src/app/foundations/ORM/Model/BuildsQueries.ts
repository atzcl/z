/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 封装一个 orm 的 Active Record 模式
|
| 目前是基于 sequelize
|
*/

import { isObject, isString } from 'util';

import { Op, Sequelize } from 'sequelize';
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
  WhereValue,
  BulkCreateOptions,
} from 'sequelize/types/lib/model';
import { isPlainObject, cloneDeep } from 'lodash';

import { BaseModel } from './BaseModel';
import { IBindings } from './Attributes/Binding';
import { BuildsQuerieException } from './Exception';
import { ITemporaryFormattings } from './Attributes/TemporaryFormattings';
import { TOperatorTypeOfKeys, getOperatorType } from './Attributes/OperatorTypes';
import { parserResult, isEmpty, hasOwnProperty, notEmptyArray, notEmptyObject } from './Utils';



// eslint-disable-next-line @typescript-eslint/no-require-imports
import Transaction = require('sequelize/lib/transaction');


export class BuildsQueries<T = any> {
  // 当前模型
  protected model: typeof BaseModel;

  // 当前模型的主键
  protected primaryKeyAttribute: string;

  /**
   * 链式设置查询属性
   */
  protected bindings: IBindings = {} as IBindings;

  /**
   * 链式设置格式属性
   */
  protected temporaryFormattings = {
    // 是否使用隐藏
    isUseHidden: true,
    // 临时值，优先级比 hidden 高
    tempHidden: [],
    // 是否使用输出显示的白名单
    isUseVisible: true,
    // 临时值，优先级比 visible 高
    tempVisible: [],
  } as ITemporaryFormattings;

  /**
   * Creates an instance of BuildsQueries.
   *
   * @param {Model} model
   */
  constructor(model: typeof BaseModel) {
    this.model = model;
    this.primaryKeyAttribute = model.primaryKeyAttribute;
  }

  protected reset() {
    this.bindings = {} as any;
    this.temporaryFormattings = {
      // 是否使用隐藏
      isUseHidden: true,
      // 临时值，优先级比 hidden 高
      tempHidden: [],
      // 是否使用输出显示的白名单
      isUseVisible: true,
      // 临时值，优先级比 visible 高
      tempVisible: [],
    }
  }

  /**
   * 设置 bindings 的某一属性的数据
   *
   * @param {keyof IBindings} property 属性名称
   * @param {any} value 属性值
   */
  protected setBinding<T extends keyof IBindings>(property: T, value: IBindings[T]) {
    this.bindings[property] = value;

    return this;
  }

  /**
   * 设置 bindings 的某一属性的数据
   *
   * @param {keyof IBindings} property 属性名称
   * @param {any} value 属性值
   */
  protected setTemporaryFormatting<T extends keyof ITemporaryFormattings>(
    property: T,
    value: ITemporaryFormattings[T],
  ) {
    this.temporaryFormattings[property] = value;

    return this;
  }

  // 跳过 hidden 处理
  skipHidden() {
    return this.setTemporaryFormatting('isUseHidden', false);
  }

  // 使用 hidden 处理
  makeHidden(hiddens: string[]) {
    return this.setTemporaryFormatting('tempHidden', hiddens);
  }

  // 跳过 visible 处理
  skipVisible() {
    return this.setTemporaryFormatting('isUseVisible', false);
  }

  // 使用 visible 处理
  makeVisible(visibles: string[]) {
    return this.setTemporaryFormatting('tempVisible', visibles);
  }

  // 查询包含软删除的数据
  withTrashed() {
    return this.setBinding('paranoid', false);
  }

  // 只查询软删除的数据
  onlyTrashed() {
    this.withTrashed();

    return this.whereNotNull('dateled_at');
  }

  /**
   * 使用事务
   *
   * @param {Transaction} transaction 事务参数
   */
  transaction(transaction: IBindings['transaction']) {
    return this.setBinding('transaction', transaction);
  }

  /**
   * 使用事务锁
   *
   * @param {Transaction} transaction 事务参数
   */
  lock(lock: IBindings['lock'] = true) {
    return this.setBinding('lock', lock);
  }

  /**
   * 启动 排他锁
   */
  lockForUpdate() {
    return this.lock(Transaction.LOCK.UPDATE);
  }

  /**
   * 启动 共享锁
   */
  sharedLock() {
    return this.lock(Transaction.LOCK.SHARE);
  }

  /**
   * 设置查询的 model attributes
   *
   * @see https://demopark.github.io/sequelize-docs-Zh-CN/querying.html
   *
   * @param {FindAttributeOptions} attributes
   */
  setAttributes(attributes: FindAttributeOptions) {
    return this.setBinding('attributes', attributes);
  }

  /**
   * 设置查询作用域
   *
   * @param {string | IBindings['scopes']} scope
   * @param {any} value
   */
  scopes(scope: string | IBindings['scopes'], value?: any) {
    const { scopes = [] } = this.bindings;

    let addScope = [] as IBindings['scopes'];

    /**
     * @example
     *  .useScope('name', 'atzcl')
     */
    if (isString(scope) && value) {
      addScope.push({ method: [scope, value] });
    } else if (Array.isArray(scope)) {
      /**
       * @example
       *  .useScope([ 'id', { method: ['name', 'atzcl'] } ])
       */
      addScope = scope;
    } else if (isString(scope)) {
      /**
       * @example
       *  .useScope('id')
       */
      addScope.push(scope);
    }

    if (addScope.length) {
      this.setBinding('scopes', [...scopes, ...addScope])
    }

    return this;
  }

  /**
   * 查询指定字段
   *
   * @param {Array<string | ProjectionAlias>} attributes
   */
  field(attributes: (string | ProjectionAlias)[]) {
    return this.setAttributes(attributes);
  }

  /**
   * 字段排除
   *
   * @param {string[]} attributes
   */
  fieldExclude(attributes: string[]) {
    return this.setAttributes({ exclude: attributes });
  }

  /**
   * 设置分组属性
   *
   * @param {FindOptions['group']} group
   */
  setGroup(group: FindOptions['group']) {
    return this.setBinding('group', group);
  }

  /**
   * 设置关联查询
   *
   * @param {FindOptions['include']} include
   */
  setInclude(includeVal: Includeable | Includeable[]) {
    const { include = [] } = this.bindings;

    return this.setBinding('include', include.concat(includeVal))
  }

  /**
   * 设置是否获取原始数据
   *
   * @param {boolean} raw
   */
  setRaw(raw: boolean) {
    return this.setBinding('raw', raw);
  }

  /**
   * 链式设置 offset 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  offset(num: number) {
    return this.setBinding('offset', Number(num));
  }

  /**
   * 链式设置 limit 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  limit(num: number) {
    return this.setBinding('limit', Number(num));
  }

  /**
   * 链式设置 offset、limit 值
   *
   * @param {number} offset
   * @param {number} limit
   *
   * @returns {this}
   */
  page(offset: number, limit: number) {
    const page = offset < 1 ? 1 : offset;

    return this.offset((page - 1) * limit).limit(limit);
  }

  /**
   * 链式设置 order 值
   *
   * @param {string} column 字段名称
   * @param {'DESC' | 'ASC'} values 排序值
   *
   * @returns {this}
   */
  orderBy(column: string, values: 'DESC' | 'ASC') {
    // TODO: 待完善多种 order 的方式
    return this.setBinding('order', [[column, values]]);
  }

  /**
   * 快捷设置升序排序
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  oldest(column = 'created_at') {
    return this.orderBy(column, 'ASC');
  }

  /**
   * 快捷设置降序排序
   *
   * @param {string} column 字段名称
   *
   * @returns {this}
   */
  latest(column = 'created_at') {
    return this.orderBy(column, 'DESC');
  }

  /**
   * 链式设置 where 条件
   *
   * @param {WhereOptions} where
   *
   * @returns {this}
   */
  where(whereOpts: WhereOptions | string, value?: WhereValue) {
    let { where = {} } = this.bindings;

    /**
     * @example where('id', 1111)
     */
    if (isString(whereOpts) && value) {
      (where as any)[whereOpts] = value;
    }

    /**
     * @example where({ id: 1 }) or 更多
     */
    if (isObject(whereOpts)) {
      where = {
        ...where,
        ...(whereOpts as object),
      }
    }

    return this.setBinding('where', where);
  }

  /**
   * 链式设置 where or 条件
   *
   * @param {string | any[]} column 字段名称
   * @param {any[]} values 查询值
   *
   * @returns {this}
   */
  orWhere(
    column: string | any[],
    operator?: TOperatorTypeOfKeys | any[],
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

    const getOperator = isString(operator) ? getOperatorType(operator) : operator;

    /**
     * @desc 第一种用法: orWhere('authorId', 'ne', 12)
     */
    if (isString(column) && isString(getOperator) && values && ! Array.isArray(values)) {
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
        [Op.or]: [{ [column]: operator }],
      });
    }

    /**
     * @desc 第三种用法:
     *   1: [ { authorId: 12 }, { authorId: 13 }]
     *   2: [ [ 'authorId', '=', 12 ], [ 'authorId', '=', 13 ] ]
     */
    if (Array.isArray(column)) {
      const realQueryParams = [];
      for (let col of column) {
        if (Array.isArray(col) && col.length === 3 && getOperatorType(col[1])) {
          // 拼接为，例： { authorId: { [Op.eq]: 12 } }
          col = { [col[0]]: { [getOperatorType(col[1])]: col[2] } };
        }

        realQueryParams.push(col);
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
  whereNull(column: string) {
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
  whereNotNull(column: string) {
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
  whereNotNullString(column: string) {
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
  whereBetween(column: string, values: any[]) {
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
  whereNotBetween(column: string, values: any[]) {
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
  whereLike(column: string, values: string) {
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
  whereNotLike(column: string, values: string) {
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
  whereIn(column: string, values: (string | number)[]) {
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
  whereNotIn(column: string, values: (string | number)[]) {
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
  protected convertQueryOptions(options: any = {}): any {
    // 合并 where
    // 使用 Symbol 作为 object 字面量时，Symbol 为不可枚举属性
    // Reflect.ownKeys(where || {}).length
    if (notEmptyObject(options.where)) {
      this.where(options.where);
    }

    // offset 偏移条件
    if (! isEmpty(options.offset)) {
      this.offset(options.offset)
    }

    // limit 限制条件
    if (! isEmpty(options.limit)) {
      this.limit(options.limit);
    }

    // order 排序条件
    if (notEmptyArray(options.order)) {
      this.setBinding('order', [...(this.bindings.order as any[] || []), ...options.order]);
    }

    // 分组查询
    if (! isEmpty(options.group)) {
      this.setGroup(options.group);
    }

    // 关联查询
    if (notEmptyArray(options.include)) {
      this.setInclude(options.include);
    }

    // 原始查询
    if (! isEmpty(options.raw)) {
      this.setRaw(options.raw);
    }

    /**
     * 因为 attributes 的用法太多，所以不做合并区分，直接替换
     *
     * @see https://demopark.github.io/sequelize-docs-Zh-CN/querying.html
     */
    if (notEmptyArray(options.attributes)) {
      this.setAttributes(options.attributes);
    }

    const { visible = [], hidden = [] } = this.model as any;

    // 事务实例不需要被克隆
    const { transaction, ...lastOptions }: any = {
      ...options,
      ...this.bindings,
      ...this.temporaryFormattings,
      visible,
      hidden,
    }

    // 克隆一份
    const result = cloneDeep(lastOptions);

    // 重置
    this.reset();

    return {
      transaction,
      ...result,
    };
  }

  /**
   * 解析可能存在的查询作用域
   *
   * @see @see https://demopark.github.io/sequelize-docs-Zh-CN/scopes.html
   */
  protected resolveScopesToModel(scopes: IBindings['scopes']) {
    return notEmptyArray(scopes) ? this.model.scope(scopes) : this.model;
  }

  /**
   * mysql json 的 json_set 函数操作
   *
   * @example
   *  _JSON_SET('field', { 'name': "atzcl", 'email': 'atzcl0310@gmail.com'})
   *
   * @param {string} column json 字段的名称
   * @param {object} value json 数据
   */
  JSON_SET(column: string, value: { [k: string]: any, }) {
    const fields = Object.keys(value).reduce(
      (previous, current) => [...previous, `$.${String(current)}`, value[String(current)]],
      [] as string[],
    );

    return { [column]: Sequelize.fn('JSON_SET', Sequelize.col(column), ...fields) };
  }

  /**
   * 通过主键检索
   */
  find<T = any>(id: number | string, columns?: string[]) {
    if (columns) {
      this.setAttributes(columns);
    }

    return this.where(this.primaryKeyAttribute, id).first<T>()
  }

  /**
   * 查询单条数据
   */
  first<T = any>(options?: FindOptions): Promise<T> {
    const resolveOptions = this.convertQueryOptions(options);

    return this.executeWrapper<T>(
      this.resolveScopesToModel(resolveOptions.scopes).findOne(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询全部数据
   */
  findAll<T = any>(options?: FindOptions) {
    const resolveOptions = this.convertQueryOptions(options);

    return this.executeWrapper<T[]>(
      this.resolveScopesToModel(resolveOptions.scopes).findAll(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询所有数据，并计算当前表的总数
   */
  findAndCountAll<T = any>(options?: FindAndCountOptions): Promise<{ count: number, data: T, }> {
    const resolveOptions = this.convertQueryOptions(options);

    return this.executeWrapper(
      this.resolveScopesToModel(resolveOptions.scopes).findAndCountAll(resolveOptions),
      resolveOptions,
      ({ count, rows }) => ({ count, data: rows }), // 自定义成功回调, 只返回总记录数、具体的数据列表
    );
  }

  protected conversionFillable(options?: CreateOptions | UpdateOptions) {
    if ((! options || ! options.fields) && this.model.getCustomizeModelAttributes('fillable').length) {
      if (! options) {
        // eslint-disable-next-line no-param-reassign
        options = {};
      }

      options.fields = this.model.getCustomizeModelAttributes('fillable') as string[];
    }

    return options;
  }

  /**
   * 创建数据
   */
  create(values: object, options?: CreateOptions): Promise<T> {
    // 判断传入的是否是普通的 object 对象
    if (! isPlainObject(values)) {
      throw new BuildsQuerieException('[create] 传入的 value 不合法');
    }

    const newOptions = this.conversionFillable(options);

    return this.executeWrapper(
      this.model.create(this.safeFilter(values), newOptions),
      newOptions || {},
    );
  }

  /**
   *
   * @param values
   * @param options
   */
  bulkCreate<T = any>(values: object[], options?: BulkCreateOptions) {
    return this.executeWrapper<T>(
      this.model.bulkCreate(
        values.map((value: object) => this.safeFilter(value)),
        options,
      ),
      options || {},
    );
  }

  /**
   * 更新数据
   */
  update<T = any>(values: object, options?: UpdateOptions): Promise<T> {
    const newOptions = this.conversionFillable(options);

    this.makeHidden(['updated_at', 'created_at']);

    const resolveOptions = this.convertQueryOptions(newOptions);

    return this.executeWrapper<T>(
      this.resolveScopesToModel(resolveOptions.scopes).update(this.safeFilter(values), resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 用主键作为更新条件
   */
  updateById<T = any>(values: object, id: string | number) {
    return this.update<T>(values, { where: { [this.primaryKeyAttribute]: id } })
      .then((res: any) => res[0] || null);
  }

  /**
   * 带条件的更新
   */
  updateByFields() {
    //
  }

  /**
   * 批量更新
   *
   * @description 注意 updateOnDuplicate 是在插入的时候如果主键冲突就执行更新操作, 后面自己拼接 SQL 实现会好些
   *
   * @see https://sequelize.org/master/class/lib/model.js~Model.html#static-method-bulkCreate
   * @see https://juejin.im/post/5cf4dfe7f265da1bc14b1371
   *
   * @param {T[]} data 更新数据
   * @param {string[]} fields 允许更新的字段名
   *
   * @return int
   */
  updateBatch<T extends object>(values: T[], fields: string[] = []) {
    const updateDatas = values
      .map(value => hasOwnProperty(value, this.primaryKeyAttribute) ? value : null)
      .filter(Boolean);

    if (! updateDatas.length || ! this.model.sequelize) {
      return []
    }

    return this.model.sequelize
      .transaction(transaction => Promise.all(
        updateDatas.map((data: any) => (
          this.where(this.primaryKeyAttribute, data[this.primaryKeyAttribute])
            .field(fields)
            .transaction(transaction)
            .update(data)
        )),
      ));
  }

  /**
   * 执行递减/递增
   *
   * @param {'increment' | 'decrement'} method
   * @param {string | string[] | { [k: string]: number, }} column 字段 or 更新设置
   * @param {number} by 递减/递增数量
   */
  incrementOrDecrement(method: 'increment' | 'decrement', column: string | string[] | { [k: string]: number, }, by = 1) {
    return this.first().then(res => (
      isObject(column)
        ? res[method](column, {})
        : res[method](column, { by })
    ));
  }

  /**
   * 递减
   *
   * @example
   *  1、where('id', 1).increment('view_count')
   *  2、where('id', 1).increment('view_count', 5)
   *  3、where('id', 1).increment({ view_count: 1, like: 1 })
   */
  increment(column: string | string[] | { [k: string]: number, }, amount = 1) {
    return this.incrementOrDecrement('increment', column, amount);
  }

  /**
   * 递减
   *
   * @example
   *  1、where('id', 1).decrement('view_count')
   *  2、where('id', 1).decrement('view_count', 5)
   *  3、where('id', 1).decrement({ view_count: 1, like: 1 })
   */
  decrement(column: string | string[] | { [k: string]: number, }, amount = 1) {
    return this.incrementOrDecrement('decrement', column, amount);
  }

  /**
   * 删除 or 软删除
   */
  destroy<T = any>(id: string | number | (string | number)[], options?: DestroyOptions): Promise<T> {
    if (Array.isArray(id)) {
      // 多个删除
      this.whereIn(this.primaryKeyAttribute, id);
    } else {
      // 单个删除
      this.where({ [this.primaryKeyAttribute]: id });
    }

    const resolveOptions = this.convertQueryOptions(options || {});

    return this.executeWrapper<T>(
      this.resolveScopesToModel(resolveOptions.scopes).destroy(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 还原软删除
   */
  restore<T = any>(id?: string, options?: DestroyOptions) {
    if (id) {
      this.where({ [this.primaryKeyAttribute]: id });
    }

    const resolveOptions = this.convertQueryOptions(options || {});

    return this.executeWrapper<T>(
      this.resolveScopesToModel(resolveOptions.scopes).restore(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 真实删除
   */
  forceDelete<T = any>(id: string | number | (string | number)[]) {
    return this.destroy<T>(id, { force: true });
  }

  /**
   * 安全过滤，过滤掉前端提交的不被允许写入的表字段
   */
  safeFilter(values: object) {
    [
      this.primaryKeyAttribute,
      'created_at',
      'updated_at',
      'deleted_at',
    ].forEach((field) => {
      if (hasOwnProperty(values, field)) {
        delete (values as any)[field];
      }
    })

    return values;
  }

  /**
   * 包装一下执行的方法，减少样板代码
   */
  protected executeWrapper<T = any>(
    executeFunction: Promise<any>,
    resolveOptions: object,
    thenCallback?: (result: any) => any,
  ): Promise<T> {
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
