"use strict";
module.exports = () => {
    return async function (ctx, next) {
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
