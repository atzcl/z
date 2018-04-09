/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 socket.io 客户端的连接或者退出
|
*/

import { Application, Context } from 'egg';

export default function packetIOMiddleware (app: Application) {
  return async (ctx: Context, next: () => Promise<any>) => {
    ctx.socket.emit('res', 'packet received!');
    console.log('packet:', app);
    await next();
  };
}
