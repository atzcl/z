"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理邮件发送相关方法
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
const base_handler_1 = require("../base_class/base_handler");
const mailer = require('nodemailer');
/**
 * @description https://nodemailer.com/message/
 */
class Mail extends base_handler_1.default {
    /**
     * 发送邮件
     *
     * @param {object} data 发送邮件的内容
     */
    async sendMail(data) {
        const { app, ctx } = this;
        // 如果是本地开发环境，就不需要发送邮件
        if (app.config.myApps.debug) {
            return false;
        }
        // 创建邮件发送对象
        const transporter = mailer.createTransport(app.config.myApps.mail_options);
        // 发送失败后，重试 5 次
        for (let i = 0; i < 5; i++) {
            try {
                await transporter.sendMail(data);
                break;
            }
            catch (e) {
                console.log(e);
                // 当重试发送到第 5 次的时候，就抛出异常
                if (i === 4) {
                    ctx.throw(500, '邮件发送失败');
                }
            }
        }
    }
}
exports.default = Mail;
