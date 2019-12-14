/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Active Record 模式
|
*/

import { Model } from 'sequelize-typescript';


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
  protected static casts: { [k: string]: any, } = {};

  /**
   * sequelize、typeorm 这类 orm 会根据定义的 column 来做底层的过滤的, 所以这里其实是可以去掉的了
   *
   * @returns {string[]} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  protected static fillable: string[] = [];

  static getCustomizeModelAttributes(attribute: 'hidden' | 'visible' | 'casts' | 'fillable') {
    return this[attribute];
  }
}
