import BaseService from '../service'

export default class IndexService extends BaseService {
  /**
   * 处理注册邮件发送
   */
  public async registerMail (): Promise<void> {
    const { ctx, app } = this

    // docs: https://nodemailer.com/message/
    const from = `${app.config.myApps.appName} <${app.config.myApps.mail_options.auth.user}>` // 发送人名称
    const to = 'atzcl47@qq.com' // 接收邮件地址
    const subject = app.config.myApps.appName + '社区帐号激活' // 邮件主题
    const html = '<p>您好：xxxx</p>wwww' // html 邮件内容

    // 可以加 await 同步发送，或者不加，异步发送
    ctx.handlers.mail.sendMail({
      from,
      to,
      subject,
      html
    })
  }
}
