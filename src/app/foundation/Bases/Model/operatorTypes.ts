/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 链式设置格式属性的默认数据
|
*/

import { Op } from 'sequelize';

/**
 * 转化为更加直观的查询类型
 */
export const operatorTypes = {
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

export type TOperatorTypeOfKeys = keyof typeof operatorTypes;

/**
 * 获取查询类型
 *
 * @param {OperatorTypeOfKeys} type
 *
 * @return {symbol}
 */
export const getOperatorType = (type: TOperatorTypeOfKeys) => operatorTypes[type] || null;
