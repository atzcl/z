/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 快捷处理 CURD
|
*/

import { isFunction } from 'util';

import { Context } from 'midway';

import { makeAfterMethodDecoratorForControllerAndInjectService } from '../Utils';


type TransformReturn = Promise<object | any[] | number | boolean | string>


export const CURD = {
  // 分页查询
  paginate: <V = any>(transform?: (originalData: V, ctx: Context) => TransformReturn) => (
    makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
      const result = await instance.service.paginate(instance.request);

      const data = transform && isFunction(transform)
        ? await transform(result.data, instance.ctx)
        : result.data

      return instance.setStatusData(data).setStatusTotal(result.count).succeed();
    })
  ),

  // 展示一条
  show: makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
    const result = await instance.service.show(instance.ctx.params.id);

    return instance.setStatusData(result).succeed();
  }),

  // 创建储存数据
  store: makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
    const result = await instance.service.store(instance.request._body());

    return instance.setStatusData(result).succeed();
  }),

  // 更新
  update: makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
    const result = await instance.service.update(instance.ctx.params.id, instance.request._body());

    return instance.setStatusData(result).succeed();
  }),

  // 删除
  destroy: makeAfterMethodDecoratorForControllerAndInjectService(async (instance) => {
    const id = String(instance.ctx.params.id).includes(',')
      ? String(instance.ctx.params.id).split(',')
      : instance.ctx.params.id;

    const result = await instance.service.delete(id);

    return instance.setStatusData(result).succeed();
  }),
}
