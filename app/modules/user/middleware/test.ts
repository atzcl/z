/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 测试中间件
|
*/

import { Context } from 'egg';

module.exports = () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    console.log('user 模块中间件', ctx);

    await next();
  };
};
