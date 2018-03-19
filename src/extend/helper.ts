/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 自定义辅助函数 [ egg 会自动加载合并到系统内置辅助函数中 ]
|
*/

import { Context } from 'egg'

/**
 * 响应返回
 *
 * @param { number } total 如果是分页返回的话，应该加上 count 总页数数据
 */
exports.toResponse = (ctx: Context, code: number, data: any, msg: string) => {
  let response = {
    code: code,
    data: data,
    msg: msg,
    time: Math.floor(new Date().getTime() / 1000)
  }

  // 响应返回
  ctx.response.body = response
}

/**
 * 获取 result 的 dataValues 值
 */
exports.getDataValues = (result: any) => {
  try {
    return result.dataValues
  } catch (error) {
    return null
  }
}
