/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 使用 Active Record 模式
|
*/

import {
  PrimaryGeneratedColumn, Column, BaseEntity, InsertResult, UpdateResult, UpdateDateColumn, SaveOptions,
} from 'typeorm';

import * as moment from 'moment';

export class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    // 利用 typeorm 的装饰器类型的特性，取巧达到 save 的时，使用 CreateDateColumn、UpdateDateColumn 装饰才能达到的自动更新时间的目的
    transformer: {
      // getter
      from: (date) => date,
      // setter
      to: (date) => {
        return date || moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
   * 获取当前时间
   */
  static getNowDate() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * 过滤操作的数据
   */
  static filterOperateData(data: object) {
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
  static _create(data: object = {}, primaryKey = 'id') {
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
  static _createAll(data: any[] = [], saveOptions: SaveOptions = {}, primaryKey = 'id') {
    // todo: 这里目前先不处理异常的问题，后面再统一处理
    // 插入数据
    return this.insert(data.map((insertData) => this.filterOperateData(insertData)), saveOptions)
      .then((result: InsertResult) => result.identifiers.map((identifier) => identifier[primaryKey])); // 返回创建的主键 id 数据
  }

  /**
   * 更新数据
   *
   * @param {object} where 更新的条件
   * @param {object} data 更新的数据
   *
   * @returns {Promise<UpdateResult>}
   *
   * @memberof BaseModel
   */
  static _update(where: object, data: object): Promise<UpdateResult> {
    // 因为没有使用 orm 的 save, 所以需要自己来实现自动维护时间更新的功能
    const updateDateColumn = this.getRepository().metadata.updateDateColumn;
    if (updateDateColumn) {
      data[ updateDateColumn.propertyName ] = this.getNowDate();
    }

    return this.update(where, this.filterOperateData(data));
  }

  /**
   * 以 id 为条件，快捷更新
   *
   * @param {(string | number)} id
   * @param {object} data
   *
   * @returns {string | number | boolean}
   *
   * @memberof BaseModel
   */
  static _updateById(id: string | number, data: object) {
    return this._update({ id }, data).then((result) => id);
  }
}
