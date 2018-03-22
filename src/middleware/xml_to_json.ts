/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 将 xml 转换为 json
|
*/

import { parseString } from 'xml2js' // xml 解析为 json
import * as getRawBody from 'raw-body' // 获取 Buffer 缓冲区数据
import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return async (ctx: Context, next: Function) => {
    // 判断请求内容类型是否为 xml
    if (ctx.request.header['content-type'] === 'text/xml') {
      // 传入 this.ctx.req [ http.IncomingMessage ] 只读流来获取 Buffer 的数据,并解码格式为 utf-8
      let buffer: any = await getRawBody(ctx.req, { encoding: true })
      // 将 xml 转化为 json // explicitArray = false 不转换成数组
      await parseString(buffer, { explicitArray : false }, (err, result) => {
        if (err) {
          app.logger.error(`【xmlToJson】 ${err}`)
          return
        }

        // 挂载新的 body
        ctx.request.body = result.xml
      })
    }

    await next()
  }
}
