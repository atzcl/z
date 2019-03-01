/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Active Record 模式
|
*/

import { Model } from 'sequelize-typescript';

export class BaseModel extends Model<any> {
  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  static getFillable(): string[] {
    return [];
  }

  /**
   * @returns {array} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  static getHidden(): string[] {
    return [];
  }

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  static getVisible(): string[] {
    return [];
  }

  /**
   * 过滤操作的数据
   */
  static filterOperateData(data: object) {
    // todo: 因为当前版本的 sequelize-typescript 底层会使用 model 声明的 column metadata 进行相应过滤
    // todo: 所以无需自己手动获取 model 的 column 来进行过滤

    // 获取模型定义的 fillable 可批量赋值的数组的值
    const fillable = this.getFillable();
    if (Array.isArray(fillable) && fillable.length > 0) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        if (! fillable.includes(keys[i])) {
          delete data[keys[i]];
        }
      }
    }

    return data;
  }
}
