"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理异常
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = () => {
    return async (ctx, next) => {
        try {
            // 无错误则直接放行
            await next();
        }
        catch (error) {
            // 状态码
            const statusCode = error.status || 500;
            // 错误提示
            const statusMessage = error.message || 'error';
            // todo: 实现邮件、微信告警
            // 响应返回
            ctx.body = {
                code: statusCode,
                data: null,
                msg: statusMessage,
                time: Date.now()
            };
        }
    };
};
