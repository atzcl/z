/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 bcrypt 加密 [ egg 会自动加载合并到全局 application 对象中 ]
|
*/

const bcryptjs = require('bcryptjs')
import { Application } from 'egg'
const ModulesSymbol = Symbol('Application#modules')

const Application = {
  /**
   * 创建 modules 对象，并挂载到 app 对象中
   *
   * @returns void
   */
  get modules (): Application {
    if (!(this as any)[ModulesSymbol]) {
      (this as any)[ModulesSymbol] = {
        config: {},
        controller: {},
        middleware: {}
      }
    }

    return (this as any)[ModulesSymbol]
  },
  /**
   * bcryptjs 加密
   *
   * @param {string} value 需要加密的值
   * @param {number} salt 加密的强度 0 - 12
   * @returns string
   */
  async createBcrypt (value: string, salt: number = 10): Promise<string> {
    return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt))
  },
  /**
   * 比对输入值与已加密值是否一致
   *
   * @param {string} value 输入值
   * @param {string} hash 已加密的 hash 值
   * @returns boolean
   */
  async verifyBcrypt (value: string, hash: string): Promise<boolean> {
    return bcryptjs.compareSync(value, hash)
  }
}

export default Application
