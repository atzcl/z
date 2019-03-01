/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Data Mapper 模式
|
*/

import { Repository, InsertResult } from 'typeorm';

export class BaseRepository extends Repository<any> {
  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  getFillable(): string[] {
    return [];
  }

  /**
   * @returns {array} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  getHidden(): string[] {
    return [];
  }

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  getVisible(): string[] {
    return [];
  }

  /**
   * 过滤操作的数据
   */
  filterOperateData(data: object) {
    // todo: 因为当前版本的 typeorm 底层会使用 entity 实体声明的 column metadata 进行相应过滤
    // todo:  所以无需自己手动获取 entity 的 column metadata 来进行过滤

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

  /**
   * 创建数据
   *
   * @param {object} [data={}]
   * @param {string} primaryKey 主键属性名
   *
   * @returns {string | number | boolean}
   *
   * @memberof BaseRepository
   */
  _create(data: object = {}, primaryKey = 'id') {
    // todo: 这里目前先不处理异常的问题，后面再统一处理
    return this.insert(this.filterOperateData(data))
      .then((result: InsertResult) => result.identifiers[0][primaryKey]);
  }

  /**
   * 批量创建数据 (typeorm 底层会进行事务处理)
   *
   * @param {any[]} [data=[]]
   * @param {string} primaryKey 主键属性名
   *
   * @returns {string[] | number[] | boolean}
   *
   * @memberof BaseRepository
   */
  _createAll(data: any[] = [], primaryKey = 'id') {
    // todo: 这里目前先不处理异常的问题，后面再统一处理
    // 插入数据
    return this.insert(data.map((insertData) => this.filterOperateData(insertData)))
      .then((result: InsertResult) => result.identifiers.map((identifier) => identifier[primaryKey])); // 返回创建的主键 id 数据
  }
}
