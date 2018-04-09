/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| socket.io 路由
|
*/

import { Application } from 'egg';

module.exports = (app: Application) => {
  const { io, modules } = app;

  // const socketIO: any = io
  // 将 loginQrCode 命名空间的 loginQrCode 事件转发给指定 controller 的 action 处理
  // 如果是转发默认的 / 主名称空间的 loginQrCode 事件的话，则是(例子) io.route('loginQrCode', io.controller.loginQrCode.index)
  // 获取微信携带参数的临时二维码
  // socketIO.of('/loginQrCode').route('getLoginQrCode', io.controller.loginQrCode.index)
  io.route('getLoginQrCode', modules.controller.wechat.login.qrCode);
};
