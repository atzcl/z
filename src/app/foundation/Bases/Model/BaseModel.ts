/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Active Record 模式
|
*/

import { isObject, isString } from 'util';

import { Op, Sequelize } from 'sequelize';
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
import { isPlainObject, cloneDeep } from 'lodash';
import { FormatTimestamp } from '@app/foundation/Decorators/Model/FormatTimestamp';
import { UUID } from '@app/foundation/Decorators/Model/UUID';
import { DefaultColumns, IDefaultColumns } from '@app/foundation/Decorators/Model/DefaultColumns';

import { IBindings, bindingsDefault } from './binding';
import { parserResult, isEmpty, hasOwnProperty } from './Utils';
import { ITemporaryFormattings, temporaryFormattingsDefault } from './temporaryFormattings';
import { TOperatorTypeOfKeys, getOperatorType } from './operatorTypes';


export {
  UUID,
  DefaultColumns,
  IDefaultColumns,
  FormatTimestamp,
};

export class BaseModel<T = any> extends Model<T> {
  /**
   * @param {string[]} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  protected static hidden: string[] = [];

  /**
   * @param {array} 输出数据时显示的属性 [ 白名单 ]
   */
  protected static visible: string[] = [];

  /**
   * @param {object} 序列化字段类型
   */
  protected static casts = {};

  /**
   * sequelize、typeorm 这类 orm 会根据定义的 column 来做底层的过滤的, 所以这里其实是可以去掉的了
   *
   * @returns {string[]} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  protected static fillable: string[] = [];

  // 当前表在当前进程的唯一标识
  protected static currentModelUniqueId: string;

  /**
   * 链式设置查询属性
   * 为了避免 static 的变量污染，这里增加表 + pid 作为 key
   */
  protected static bindings: { [k: string]: IBindings, } = {};

  /**
   * 链式设置格式属性
   * 为了避免 static 的变量污染，这里增加表 + pid 作为 key
   */
  protected static temporaryFormattings: { [k: string]: ITemporaryFormattings, } = {};

  /**
   * 检查当前模型的 bindings、temporaryFormattings 数据是否存在，如果不存在，就创建对应模型的默认数据
   *
   * @param {boolean} forceReset 是否强制重置对应模型的默认数据
   */
  static checkOrMakeDefaultData(forceReset = false) {
    if (! this.currentModelUniqueId) {
      this.currentModelUniqueId = `${this.getTableName()}_${process.pid}`;
    }

    if (! this.bindings[this.currentModelUniqueId] || forceReset) {
      this.bindings[this.currentModelUniqueId] = cloneDeep(bindingsDefault);
    }

    if (! this.temporaryFormattings[this.currentModelUniqueId] || forceReset) {
      this.temporaryFormattings[this.currentModelUniqueId] = cloneDeep(temporaryFormattingsDefault);
    }
  }

  // 获取当前表的 bindings 数据
  static getBindings() {
    this.checkOrMakeDefaultData();

    return this.bindings[this.currentModelUniqueId]
  }

  /**
   * 设置 bindings 的某一属性的数据
   *
   * @param {keyof IBindings} property 属性名称
   * @param {any} value 属性值
   */
  static setBinding<T extends keyof IBindings>(property: T, value: IBindings[T]) {
    this.getBindings()[property] = value;

    return this;
  }

  // 获取当前表的 temporaryFormattings 数据
  static getTemporaryFormattings() {
    this.checkOrMakeDefaultData();

    return this.temporaryFormattings[this.currentModelUniqueId]
  }

  /**
   * 设置 bindings 的某一属性的数据
   *
   * @param {keyof IBindings} property 属性名称
   * @param {any} value 属性值
   */
  static setTemporaryFormatting<T extends keyof ITemporaryFormattings>(property: T, value: ITemporaryFormattings[T]) {
    this.getTemporaryFormattings()[property] = value;

    return this;
  }

  /**
   * 因为都使用了 static 静态属性来储存，所以在本次操作结束后，需要将当前 model 的相关属性值初始化一下
   */
  static resetModel() {
    this.checkOrMakeDefaultData(true);
  }

  // 使用 hidden 处理
  static useHidden(hiddens?: string[]) {
    if (hiddens && hiddens.length) {
      return this.setTemporaryFormatting('tempHidden', hiddens);
    }

    return this;
  }

  // 使用 visible 处理
  static useVisible(visibles?: string[]) {
    if (visibles && visibles.length) {
      return this.setTemporaryFormatting('tempVisible', visibles);
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
    return this.setBinding('attributes', attributes);
  }

  /**
   * 查询指定字段
   *
   * @param {Array<string | ProjectionAlias>} attributes
   */
  static field(attributes: (string | ProjectionAlias)[]) {
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
    return this.setBinding('group', group);
  }

  /**
   * 设置关联查询
   *
   * @param {FindOptions['include']} include
   */
  static setInclude(includeVal: Includeable | Includeable[]) {
    const { include } = this.getBindings();

    return this.setBinding('include', include.concat(includeVal))
  }

  /**
   * 设置是否获取原始数据
   *
   * @param {boolean} raw
   */
  static setRaw(raw: boolean) {
    return this.setBinding('raw', raw);
  }

  /**
   * 链式设置 offset 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  static offset(num: number) {
    return this.setBinding('offset', Number(num));
  }

  /**
   * 链式设置 limit 值
   *
   * @param {number} num
   *
   * @returns {this}
   */
  static limit(num: number) {
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
  static page(offset: number, limit: number) {
    this.offset(offset - 1).limit(limit);

    return this;
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
    return this.setBinding('where', {
      ...this.getBindings().where,
      ...where,
    });
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
  static whereIn(column: string, values: (string | number)[]) {
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
  static whereNotIn(column: string, values: (string | number)[]) {
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
    } = this.getBindings();

    // 合并 where
    // 使用 Symbol 作为 object 字面量时，Symbol 为不可枚举属性
    if (hasOwnProperty(options, 'where') || Reflect.ownKeys(where || {}).length) {
      options.where = { ...options.where || {}, ...where };
    }

    // offset 偏移条件
    if (! hasOwnProperty(options, 'offset') && ! isEmpty(offset)) {
      options.offset = offset;
    }

    // limit 限制条件
    if (! hasOwnProperty(options, 'limit') && ! isEmpty(limit)) {
      options.limit = limit;
    }

    // order 排序条件
    if ((options.order && Array.isArray(options.order)) || (order as string[]).length) {
      options.order = [...(order as string[]), ...options.order || []];
    }

    // 分组查询
    if (! options.group && group) {
      options.group = group;
    }

    // 关联查询
    if (! options.include && (Array.isArray(include) && include.length)) {
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
      (Array.isArray(attributes) && attributes.length)
      || (isObject(attributes) && Object.keys(attributes as object).length)
    ) {
      options.attributes = attributes;
    }

    // 拷贝一份解析结果，然后传递使用，避免污染
    const cloneDeepOptions = cloneDeep({
      ...options,
      ...this.getTemporaryFormattings(),
      visible: this.visible,
      hidden: this.hidden,
    });

    // 解析完后就重置，比如污染后续操作
    this.resetModel();

    return cloneDeepOptions;
  }

  /**
   * mysql json 的 json_set 函数操作
   *
   * @param {string} column json 字段的名称
   * @param {object} value json 数据
   */
  static _JSON_SET(column: string, value: { [k: string]: any, }) {
    const fields = Object.keys(value).reduce(
      (previous, current) => [...previous, `$.${String(current)}`, value[String(current)]],
      [] as string[],
    );

    return { [column]: Sequelize.fn('JSON_SET', Sequelize.col(column), ...fields) };
  }

  /**
   * 查询单条数据
   */
  static _findOne<T = any>(options?: FindOptions): Promise<any> {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper<T>(
      this.findOne(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询全部数据
   */
  static _findAll<T = any>(options?: FindOptions) {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper<T[]>(
      this.findAll(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 查询所有数据，并计算当前表的总数
   */
  static _findAndCountAll(options?: FindAndCountOptions) {
    const resolveOptions = this.resolveQueryOptions(options);

    return this._executeWrapper(
      this.findAndCountAll(resolveOptions),
      resolveOptions,
      ({ count, rows }) => ({ count, data: rows }), // 自定义成功回调, 只返回总记录数、具体的数据列表
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
        // eslint-disable-next-line no-param-reassign
        options = {};
      }

      options.fields = this.fillable;
    }

    // 删除可能存在的 id
    if (hasOwnProperty(values, this.primaryKeyAttribute)) {
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
  static _update<T = any>(values: object, options: UpdateOptions) {
    if (! options.fields && this.fillable.length) {
      options.fields = this.fillable;
    }

    this.useHidden(['updated_at', 'created_at']);

    const resolveOptions = this.resolveQueryOptions(options);

    delete (values as any).id;

    return this._executeWrapper<T>(
      this.update(values, resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 用主键作为更新条件
   */
  static _updateById<T = any>(values: object, id: string | number) {
    return this._update<T>(values, { where: { [this.primaryKeyAttribute]: id } })
      .then((res: any) => res[0] || null);
  }

  /**
   * 删除 or 软删除
   */
  static _destroy<T = any>(id: string | number | (string | number)[], options?: DestroyOptions) {
    if (Array.isArray(id)) {
      // 多个删除
      this.whereIn(this.primaryKeyAttribute, id);
    } else {
      // 单个删除
      this.where({ [this.primaryKeyAttribute]: id });
    }

    const resolveOptions = this.resolveQueryOptions(options || {});

    return this._executeWrapper<T>(
      this.destroy(resolveOptions),
      resolveOptions,
    );
  }

  /**
   * 真实删除
   */
  static _forceDelete<T = any>(id: string | number | (string | number)[]) {
    return this._destroy<T>(id, { force: true });
  }

  /**
   * 包装一下执行的方法，减少样板代码
   */
  static _executeWrapper<T = any>(
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
