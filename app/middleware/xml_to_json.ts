/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 将 xml 转换为 json
|
*/

import { Application, Context } from 'egg';
import * as getRawBody from 'raw-body'; // 获取 Buffer 缓冲区数据
import { parseString } from 'xml2js'; // xml 解析为 json

export default function xmlToJsonMiddleware (app: Application) {
  return async (ctx: Context, next: () => Promise<any>) => {
    // 判断请求内容类型是否为 xml
    if (ctx.request.header['content-type'] === 'text/xml') {
      // 传入 this.ctx.req [ http.IncomingMessage ] 只读流来获取 Buffer 的数据,并解码格式为 utf-8
      const buffer: any = await getRawBody(ctx.req, { encoding: true });
      // 将 xml 转化为 json // explicitArray = false 不转换成数组
      await parseString(buffer, { explicitArray : false }, (err, result) => {
        if (err) {
          app.logger.error(`【xmlToJson】 ${err}`);
          return;
        }

        // 挂载新的 body
        ctx.request.body = result.xml;
      });
    }

    await next();
  };
}
