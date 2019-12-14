/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 处理邮件发送相关方法
|
*/

import * as mailer from 'nodemailer';

import { AppFlowException } from '@/app/exceptions/AppFlowException';

// eslint-disable-next-line @typescript-eslint/no-require-imports
import SMTPConnection = require('nodemailer/lib/smtp-connection');


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

/**
 * @description https://nodemailer.com/message/
 */
export class Mail {
  options: SMTPConnection.Options;

  constructor(options: any) {
    this.options = options
  }

  /**
   * 发送邮件
   *
   * @param {object} data 发送邮件的内容
   */
  async send(data: SendMailData) {
    // 创建邮件发送对象
    const transporter = mailer.createTransport(this.options);

    // 发送失败后，重试 5 次
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      try {
        transporter.sendMail(data);
        break;
      } catch (error) {
        // 当重试发送到第 5 次的时候，就抛出异常
        if (i === 4) {
          throw new AppFlowException(`【邮件发送失败】${error}`, 500)
        }
      }
    }
  }
}
