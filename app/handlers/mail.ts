/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 处理邮件发送相关方法
|
*/

import BaseHandler from './base_handler';

import * as mailer from 'nodemailer';

/**
 * @description https://nodemailer.com/message/
 */
export default class Mail extends BaseHandler {
  /**
   * 发送邮件
   *
   * @param {object} data 发送邮件的内容
   */
  public async sendMail (data: SendMailData) {
    const { app, ctx } = this;

    // 创建邮件发送对象
    const transporter = await mailer.createTransport(app.config.apps.mail_options);

    // 发送失败后，重试 5 次
    for (let i = 0; i < 5; i++) {
      try {
        await transporter.sendMail(data);
        break;
      } catch (e) {
        // 当重试发送到第 5 次的时候，就抛出异常
        if (i === 4) {
          return ctx.abort(500, `【邮件发送失败】${e}`);
        }
      }
    }
  }
}

interface SendMailData {
  from?: string;
  to?: string;
  subject?: string;
  html?: string | Buffer;
  text?: string | Buffer;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}
