/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 自定义辅助函数 [ egg 会自动加载合并到系统内置辅助函数中 ]
|
*/

import { Context } from 'egg';

const xtendHelper = {
  /**
   * 响应返回
   *
   * @param { number } total 如果是分页返回的话，应该加上 count 总页数数据
   */
  toResponse (ctx: Context, codeData: number, dataData: any, msgData: string) {
    const response = {
      code: codeData,
      data: dataData,
      msg: msgData,
      time: Math.floor(new Date().getTime() / 1000),
    };

    // 响应返回
    ctx.response.body = response;
  },
  /**
   * Socket 的响应数据格式
   *
   * @param {number} codeData 状态
   * @param {any} dataData 数据
   * @param {string} msgData 消息
   */
  toSocketResponse (codeData: number = 200, dataData: any = '', msgData: string = 'success') {
    return {
      code: codeData,
      data: dataData,
      msg: msgData,
      time: Math.floor(new Date().getTime() / 1000),
    };
  },
  /**
   * 获取 result 的 dataValues 值
   */
  getDataValues (result: any) {
    try {
      return result.dataValues;
    } catch (error) {
      return null;
    }
  },
  parseMsg (action: string, payload: object = {}, metadata: object = {}) {
    const meta = { timestamp: Date.now(), ...metadata };

    return {
      data: {
        action,
        payload,
      },
      meta,
    };
  },
};

export default xtendHelper;
