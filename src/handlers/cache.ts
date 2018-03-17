/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 缓存管理
|
*/

import { isNull } from 'lodash'
import BaseHandler from '../base_class/base_handler'

export default class CacheManager extends BaseHandler {
  // 使用缓存类型 [ 以后拓展 ]
  private get store () {
    // return this.app['redis']
    return this.app.redis
  }

  /**
   * 给缓存标识添加 prefix 前缀
   *
   * @param {string} key 缓存标识
   * @returns {string}
   */
  public getPrefixKey (key: string): string {
    return `${this.app.config.name}_${key}`
  }

  /**
   * 设置字符串类型缓存
   *
   * @param {string} key 缓存标识
   * @param {string|number}    value 缓存的数据
   * @param {number} time 缓存过期时间
   * @param {string} unit 指定时间单位 （h/m/s/ms）
   */
  public async set (key: string, value: string | number, time: number = 0, unit: string = '') {
    if (isNull(key) || isNull(value)) {
      throw new Error('[cache]: 请传入正确参数')
    }

    if (!isNull(time)) {
      // 设置了过期时间并使用了快捷时间单位
      if (!isNull(unit)) {
        // 转换为小写
        unit = unit.toLowerCase()

        // 判断时间单位
        switch (unit) {
          case 'h':
            time *= 3600
            break
          case 'm':
            time *= 60
            break
          case 's':
            break
          case 'ms':
            break
          default:
            throw new Error('[cache]: 时间单位只能是：h/m/s/ms')
        }

        // EX: 单位为秒; PX: 单位为毫秒
        let mill = unit === 'ms' ? 'PX' : 'EX'

        return this.store.set(key, value, mill, time)
      }
    }

    // 不设置过期时间
    return this.store.set(key, value)
  }

  /**
   * 获取缓存
   *
   * @param {string} key 缓存标识
   */
  public async get (key: string) {
    if (isNull(key)) {
      throw new Error('[cache]: 请传入需要获取的缓存名称')
    }

    try {
      return this.store.get(this.getPrefixKey(key))
    } catch (error) {
      throw new Error('[cache]: get 方法只能获取 string 类型缓存')
    }
  }

  /**
   * 判断缓存是否存在
   *
   * @param {string} key
   */
  public async has (key: string) {
    //
  }
}
