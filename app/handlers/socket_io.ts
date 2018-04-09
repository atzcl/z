/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| socket.io 的一些常y用封装
|
*/

import BaseHandler from './base_handler';

export default class SocketIO extends BaseHandler {
  /**
   * 返回挂载在 app 对象上的 io 实例
   *
   * @returns {SocketIO}
   */
  get io () {
    return this.app.io;
  }

  /**
   * 判断 client_id 是否在线
   *
   * @param {string} clientID client_id
   * @param {string} nsp 命名空间
   */
  public async isOnline (clientID: string, nsp: string = '/') {
    return this.io.of(nsp).clients((error: Error, clients: string[]) => {
      if (error) {
        return false;
      }

      return clients.includes(clientID);
    });
  }

  /**
   * 向客户端 client_id 发送数据
   *
   * @param {string} clientID client_id
   * @param {string} emit 事件
   * @param {any} sendData 发送的数据
   * @param {string} nsp 命名空间
   */
  public async sendToClient (clientID: string, emit: string, sendData: any, nsp: string = '/') {
    this.io.of(nsp).to(clientID).emit(emit, sendData);
  }
}
