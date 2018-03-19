/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Repository 基类
|
*/

import { forOwn, isNull, isArray } from 'lodash'
import { Model } from 'sequelize'
import { BaseContextClass } from 'egg'

export default abstract class BaseRepository extends BaseContextClass {
  /**
   * 定义必须实现的抽象方法
   * @return {Model} 返回当前 Repository 的模型
   */
  abstract get model (): Model<{}, {}>

  /**
   * 通过在模型定义的 fillable 方法来过滤入库字段数据
   *
   * @returns {object}
   */
  public async fill (): Promise<object> {
    // 为了不对请求的数据造成污染，这样应该是储存比对符合的数据，然后返回调用者
    let result: any = {}

    // todo: 待实现避免恶意传递过大 body 数据，导致遍历耗时过长
    forOwn(this.ctx.request.body, (value: any, key: string) => {
      // 判断当前遍历的 key 是否存在在 model 定义的【可以批量赋值】的数组里
      if (this.model.fillable().includes(key)) {
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
    // try {
    //   if (!isNull(result) && this.model.hidden().length > 0) {
    //     console.log(result.dataValues)
    //   }
    // } catch (error) {
    //   // console.log(error)
    // }

    return result
  }

  /**
   * 创建数据
   */
  public async created () {
    // 获取过滤后的请求数据
    let body = await this.fill()

    // 返回创建结果
    return this.model.create(body)
  }

  /**
   * 获取指定条件的单条数据
   *
   * @param {string} field 查询字段
   * @param {string | number | boolean} value 查询字段值
   */
  public async findByField (field: string, value: string | number | boolean) {
    let whereObj: any = {}
    whereObj[field] = value

    return this.parserResult(await this.model.findOne({ where: whereObj }))
  }
}
