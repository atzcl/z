/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 socket.io 客户端的连接或者退出
|
*/

import { Application, Context } from 'egg';

export default function connectionIOMiddleware () {
  return async (ctx: Context, next: () => Promise<any>) => {
    ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.
    console.log('disconnection!');
  };
}
