/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证 body 的方法装饰器
|
*/

import { Context } from 'midway';

// todo: 后面可以参考 midway 一样, 在启动的时候，扫描所有的验证规则类，然后将对应的类型写入这个属性中，以达到编辑器智能提示的目的
export type validateIdentifier = 'userLoginValidate';

/**
 * @internal 只能挂载在控制器的方法中，另: 在 midway 框架中，控制器的第一个参数是 egg 的 ctx，
 *           所以这里需要根据需求来做调整
 *
 * @param {string} identifier 注册在 IoC 容器内的对应验证类的 id
 */
export function validate (identifier: validateIdentifier) {
  // target 参数,对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  // key 成员的名字，其实就是函数名字
  // descriptor 成员的属性描述符
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    // 被装饰的函数被保存在 value 中 [ 保存原有方法 ]
    const originFunction = descriptor.value;
    descriptor.value = async function (...params) {
      /**
       * @see 请看上面的注释
       */
      const ctx: Context = (this as any).ctx;

      const validateRuleInstance = ctx.requestContext.get(identifier);
      const rules = validateRuleInstance.rules(ctx);

      if (Object.keys(rules).length > 0) {
        // todo: 待实现自定义错误信息
        // 执行 egg-validate 验证方法，验证当前请求数据的是否合法
        await ctx.validate(rules, ctx.request.body);
      }

      // 执行被装饰的函数自己
      await originFunction.apply(this, arguments);
    };
  };
}
