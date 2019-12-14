/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 辅助创建自定义装饰器
|
*/

import { InvalidDecoratorException } from '@app/exceptions/InvalidDecoratorException';

import { Controller } from '../../Bases/BaseController';
import { Service } from '../../Bases/BaseService';

// 前置处理
export type BeforeHandler<C extends Controller>= (instance: C, target: ClassDecorator) => Promise<void>

const verifyExtendsBaseController = (ctx: any, name: string) => {
  if (! ctx) {
    throw new InvalidDecoratorException(`${name} 未正确继承 BaseController`);
  }
}

const verifyExtendsBaseService = (ctx: any, name: string) => {
  if (! ctx) {
    throw new InvalidDecoratorException(`${name} 未正确继承 BaseService`);
  }
}

/**
 * 辅助创建 Controller 的方法装饰器
 *
 * @example
 *
 * @param {any} target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * @param {string} key 成员的名字，其实就是函数名字
 * @param {PropertyDescriptor} descriptor 成员的属性描述符
 */
export const makeMethodDecoratorForController = <C extends Controller>(beforeHandler: BeforeHandler<C>) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => {
  const originFunction = descriptor.value;

  descriptor.value = async function() {
    verifyExtendsBaseController((this as C).ctx, target.name);

    await beforeHandler(this as C, target);

    // eslint-disable-next-line prefer-rest-params
    return originFunction.apply(this, arguments);
  };

  return descriptor;
}

/**
 * 辅助创建 Controller 并且是已经按照约定注入对应 Service 的方法装饰器工具函数
 *
 * @example
 *
 * @param {any} target 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
 * @param {string} key 成员的名字，其实就是函数名字
 * @param {PropertyDescriptor} descriptor 成员的属性描述符
 */
export const makeMethodDecoratorForControllerAndInjectService = <C extends Controller & { service: Service, }>(
  beforeHandler: BeforeHandler<C>,
) => makeMethodDecoratorForController<C>(async (instance, target) => {
  verifyExtendsBaseService(instance.service, target.name);

  await beforeHandler(instance, target);
})


/**
 * 创建后置处理方法装饰器
 *
 * @param afterHandler
 */
export const makeAfterMethodDecoratorForController = <C extends Controller>(afterHandler: BeforeHandler<C>) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => {
  const originFunction = descriptor.value;

  descriptor.value = async function() {
    verifyExtendsBaseController((this as C).ctx, target.name);

    // eslint-disable-next-line prefer-rest-params
    await originFunction.apply(this, arguments);

    return afterHandler(this as C, target)
  };

  return descriptor;
}

/**
 * 创建后置处理方法装饰器
 *
 * @param afterHandler
 */
export const makeAfterMethodDecoratorForControllerAndInjectService = <C extends Controller & { service: Service, }>(
  beforeHandler: BeforeHandler<C>,
) => makeAfterMethodDecoratorForController<C>(async (instance, target) => {
  verifyExtendsBaseService(instance.service, target.name);

  await beforeHandler(instance, target);
})
