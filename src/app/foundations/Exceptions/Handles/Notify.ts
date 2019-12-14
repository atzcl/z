/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 应用异常通知
|
*/

import { forOwn } from 'lodash';

import { Ip2Region } from '../../Support/Ip2Region';
import { Mail } from '../../Support/Mail';
import { WeChat } from '../../WeChat';
import { Dingtalk } from '../../Dingtalk';


export interface Config {
  ip: string;
  exceptionNotify: {
    enable: boolean,
    type: 'dingtalk' | 'wechat' | 'mail',

    wechatOpt: {
      touser: string, // 接收通知的用户 open_id
      templateId: string, // 模板消息的 id
    },

    emailOpt: {
      to: string, // 接收通知的用户邮件地址
      from: string,
    },
  };
  appName: string;
  url: string;
}

interface Props extends Config{
  error: Error;
  regionInfo: string;
}

export class ExceptionNotify {
  // 异常黑名单
  private exceptionBlacklist = ['AppFlowException', 'ValidationException'];

  mail: Mail | undefined

  wechat: WeChat | undefined

  dingtalk: Dingtalk | undefined

  constructor({ mail, wechat, dingtalk }: { mail?: Mail, wechat?: WeChat, dingtalk?: Dingtalk, }) {
    this.mail = mail;
    this.wechat = wechat;
    this.dingtalk = dingtalk;
  }

  /**
   * 处理异常通知
   */
  async handler(error: Error, params: Config, logger: any = console) {
    // 不管什么错误，都应该记录错误到 log 中
    logger.error(error);

    const { exceptionNotify, ip } = params;

    // 判断是否开启
    if (! exceptionNotify.enable) {
      return;
    }

    // 判断当前异常是否存在黑名单中，如果存在，就不发送，这是为了避免一些手动抛出异常也会被通知，这没必要
    if (this.exceptionBlacklist.includes(error.name)) {
      return;
    }

    // 获取访问 ip 的地址信息
    const region = await Ip2Region(ip);
    const regionInfo = `${region.region} - ${region.province}${region.city} - ${region.isp}`;

    const props = {
      ...params,
      error,
      regionInfo,
    }

    // 判断通知类型
    switch (exceptionNotify.type) {
      case 'wechat':
        return this.wechat && this.wechatNotify(props).catch((err: Error) => logger.error(`${err}`));
      case 'mail':
        return this.mail && this.emailNotify(props).catch((err: Error) => logger.error(`${err}`));
      case 'dingtalk':
        return this.mail && this.dingtalkNotify(props).catch((err: Error) => logger.error(`${err}`));
      default:
        // 啥也不干，，
    }
  }

  /**
   * 微信通知
   */
  async wechatNotify(props: Props) {
    const {
      regionInfo, ip, url, appName, error, exceptionNotify,
    } = props;

    // 微信模板消息需要的数据
    const templateData: any = {
      // 应用名称
      name: appName,
      // 异常路由
      router: url,
      // 触发 IP
      ip,
      // 触发地区
      region: regionInfo,
      // 异常类型
      type: error.name,
      // 异常时间
      time: new Date().toLocaleString(),
      // 异常信息
      stack: error.stack,
    };

    // 组装数据
    forOwn(templateData, (value, key) => {
      templateData[key] = {
        value,
        color: '#f5222d',
      };
    });

    // 发送模板信息
    return this.wechat && (this.wechat.officialAccount as any).template_message.send({
      touser: exceptionNotify.wechatOpt.touser,
      template_id: exceptionNotify.wechatOpt.templateId,
      data: templateData,
    });
  }

  /**
   * 邮件通知
   */
  async emailNotify(props: Props) {
    const {
      regionInfo, error, appName, exceptionNotify, url, ip,
    } = props;

    // docs: https://nodemailer.com/message/
    // 发送人名称
    const from = `${appName} <${exceptionNotify.emailOpt.from || '---'}>`;
    // 接收邮件地址
    const { to } = exceptionNotify.emailOpt;
    // 邮件主题
    const subject = `${appName} 应用异常信息`;
    // html 邮件内容
    const html = `<table style="width: 80vw; margin: 20px auto; background: #fff; box-shadow: 0px 2px 18px 0 rgba(122, 135, 142, 0.33); border-radius: 10px;font-size: 14px; line-height: 1.5; color: rgba(0, 0, 0, 0.55); padding: 10px 15px;"><tbody><tr style="width: 100%;"><td style="width: 80px; padding: 6px 0px; ">应用名称:<td style="margin: 20px; color: #1890ff">${appName}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常路由:<td style="margin: 20px; color: #1890ff">${url}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">触发 IP:<td style="margin: 20px; color: #1890ff">${ip}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">触发地区:<td style="margin: 20px; color: #1890ff">${regionInfo}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常类型:<td style="margin: 20px; color: #1890ff">${error.name}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常时间:<td style="margin: 20px; color: #1890ff">${new Date().toLocaleString()}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常信息:<td style="margin: 20px; color: #1890ff; white-space: pre; display: block;">${error.stack}</table>`;

    return this.mail && this.mail.send({
      from,
      to,
      subject,
      html,
    })
  }

  // 钉钉
  async dingtalkNotify(props: Props) {
    const {
      regionInfo, error, appName, url, ip,
    } = props;

    return this.dingtalk && this.dingtalk.markdown({
      title: `${appName} 应用异常信息`,
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      text: '**异常路由**:  ' + url + '\n\n'
      + '**异常类型**:  ' + error.name + '\n\n'
      + '**异常时间**:  ' + new Date().toLocaleString() + '\n\n'
      + '**触发 IP**:  ' + ip + '\n\n'
      + '**触发地区**:  ' + regionInfo + '\n\n'
      + '**异常信息**:  ' + error.message + '\n\n'
      + '**异常堆栈**: \n\n'
      + '> ' + error.stack,
    }).send()
  }
}
