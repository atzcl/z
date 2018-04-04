/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 模块 Repository 基类
|
*/

import { Model, Instance } from 'sequelize'
import { BaseContextClass } from 'egg'
import { forOwn, isNull, isArray } from 'lodash'

export default abstract class BaseRepository extends BaseContextClass {
  /**
   * @var {object} 自定义条件
   */
  private condition: object = {}

  /**
   * @var {object} 保存排序条件
   */
  private order: string[] = []

  /**
   * 定义必须实现的抽象方法
   * @return {Model} 返回当前 Repository 的模型
   */
  abstract get model (): Model<{}, {}>

  /**
   * 增加 where 条件
   *
   * @param wheres 条件值
   */
  public applyConditions (wheres: object[]) {
    // 添加 where 条件
    wheres.map(value => {
      Object.keys(value).forEach((val, key) => {
        // 将本次循环的条件挂载到 condition 上
        (this.condition as any)[val] = (value as any)[val]
      })
    })

    return this
  }

  /**
   * 增加 where 条件
   *
   * @param {string} value 条件值
   * @returns {this}
   */
  public where (value: object): this {
    this.condition = Object.assign(this.condition, value)

    return this
  }

  /**
   * 将 where 条件重置为初始状态
   *
   * @returns {this}
   */
  public resetWhere () {
    this.condition = {}

    return this
  }

  /**
   * 添加排序条件
   *
   * @param {string} column 排序字段
   * @param {string} direction 升/降序
   * @returns {this}
   */
  public orderBy (column: string, direction: string = 'desc'): this {
    (this as any).order.push([ column, direction ])

    return this
  }

  /**
   * 通过在模型定义的 fillable 方法来过滤入库字段数据
   *
   * @returns {object}
   */
  public async fill (body: object | null = null): Promise<object> {
    // 为了不对请求的数据造成污染，这样应该是储存比对符合的数据，然后返回调用者
    let result: any = {}

    // 获取模型定义的 fillable 可批量赋值的数组的值
    let fillable: string[] = this.model.fillable()

    // 判断 fillable 是否为空，如果是，那么直接获取对应 model 定义的所有字段来进行过滤
    if (fillable.length === 0) {
      fillable = this.model.getAttributes()
    }

    // todo: 待实现避免恶意传递过大 body 数据，导致遍历耗时过长
    forOwn(body || this.ctx.request.body, (value: any, key: string) => {
      // 判断当前遍历的 key 是否存在在 model 定义的【可以批量赋值】的数组里
      // todo: 后续实现将定义的字段类型跟传入的数据类型进行对比、转换
      if (fillable.includes(key)) {
        result[key] = value
      }
    })

    return result
  }

  /**
   * 包装输出数据 [ 后面拓展获取器 ]
   *
   * @param {any} result 需要包装的数据
   */
  public async parserResult (result: any) {
    // 重置 where 条件
    await this.resetWhere()

    try {
      // 判断执行结果，当使用 update 方法时，成功返回是一个数组，[ 1 ]
      return isNull(result) ? null : (isArray(result) ? result[0] : (result as Instance<any>).toJSON())
    } catch (error) {
      return null
    }
  }

  /**
   * 创建数据
   *
   * @param {object | null} data 创建的数据
   */
  public async create (data: object | null = null) {
    // 获取过滤后的请求数据
    let body = data || await this.fill()

    // 返回创建结果
    return this.parserResult(
      await this.model.create(body)
    )
  }

  /**
   * 查询符合条件的第一条数据
   *
   * @param {object} attributes 查询条件
   */
  public async first (attributes: object = {}) {
    return this.parserResult(
      await this.model.findOne({
        where: Object.assign(this.condition, attributes),
        order: this.order
      })
    )
  }

  /**
   * 获取指定条件的单条数据
   *
   * @param {string} field 查询字段
   * @param {string | number | boolean} value 查询字段值
   */
  public async findByField (field: string, value: string | number | boolean) {
    let whereObject: any = {}
    whereObject[field] = value

    return this.parserResult(
      await this.model.findOne({
        where: Object.assign(this.condition, whereObject),
        order: this.order
      })
    )
  }

  /**
   * 查找 or 新增
   *
   * @param attributes 查找条件
   * @param values 当查找不存在的时候，新增的数据
   * @returns any
   */
  public async firstOrCreate (attributes: object, values: object = {}) {
    // 根据传入条件进行查询
    let result = await this.parserResult(
      await this.model.findOne({ where: attributes })
    )

    // 如果有数据，就直接返回
    if (!isNull(result)) {
      return result
    }

    // 返回新增数据
    return this.create(Object.assign(await this.fill(values), attributes))
  }

  /**
   * 更新
   *
   * @param {object} data 更新的数据对象 { field: value }
   * @param {object} whereObject 更新条件
   */
  public async update (data: object, whereObject: object | any = {}) {
    return this.parserResult(
      await this.model.update(data, { where: Object.assign(this.condition, whereObject) })
    )
  }
}
