/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 验证 body 的方法装饰器
|
*/

import { forEach } from 'lodash'

export function validateBody (path: string) {
  // target 参数,对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // key 成员的名字，其实就是函数名字
  // descriptor 成员的属性描述符
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    // 被装饰的函数被保存在 value 中 [ 保存原有方法 ]
    const originFun = descriptor.value
    // 重写原有方法
    descriptor.value = async function () {
      const { ctx } = (this as any)

      // 切割传入的路径字符串
      const getValidatePath: string[] = path.split('.')

      // 为了不污染整个 ctx.validateRule,这里获取到该验证器的对象供下方使用
      let validateRule = ctx.validateRule[getValidatePath[0]]

      // 因为上面已经取了第一个数值，虽然这样需要将其剔除
      getValidatePath.splice(0, 1)
      // 遍历获取最终调用的方法
      forEach(getValidatePath, (value, key) => {
        // 默认【遍历到最后的一个数值就为返回验证数据的可执行方法】，所以这里调用它，并终止循环
        if (key === (getValidatePath.length - 1)) {
          validateRule = validateRule[value]()
          return true
        }

        // 循环更新 ctx.validateRule 对象
        validateRule = validateRule[value]
      })

      // 执行 egg-validate 验证方法，验证当前请求数据的是否合法
      await ctx.validate(validateRule)

       // 执行被装饰的函数自己
      await originFun.call(this, ctx.request.body)
    }
  }
}
