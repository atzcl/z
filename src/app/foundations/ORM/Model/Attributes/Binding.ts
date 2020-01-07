/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 链式查询属性的默认数据
|
*/

import {
  WhereOptions, GroupOption, Order, FindAttributeOptions, Includeable, Transaction, Model,
} from 'sequelize/types';


export type TScopesValue = (string | { method: string | [string, ...unknown[]], })[];

export type TTransactionLOCK = keyof typeof Transaction.LOCK;


export interface IBindings {
  /**
   * Attribute has to be matched for rows to be selected for the given action.
   */
  where: WhereOptions;

  /**
   * Skip the results;
   */
  offset: number | undefined;

  /**
   * Limit the results
   */
  limit: number | undefined;

  /**
   * GROUP BY in sql
   */
  group: GroupOption | undefined;

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order: Order;

  /**
   * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
   * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
   * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
   * have in the returned instance
   */
  attributes: FindAttributeOptions;


  /**
   * A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}`, `{ include: [{ model: Model1, as: 'Alias' }]}` or
   * `{ include: [{ all: true }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   */
  include: Includeable[];
  /**
   * Return raw result. See sequelize.query for more information.
   */
  raw: boolean;

  /**
   * Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   */
  lock: boolean | TTransactionLOCK | { level: TTransactionLOCK, of: typeof Model, };

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  // 查询作用域
  scopes: TScopesValue;

  // 开启/隐藏软删除的标识
  paranoid?: boolean;
}

export const bindingsDefault = {
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
