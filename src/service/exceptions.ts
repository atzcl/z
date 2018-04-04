/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 应用异常通知服务
|
*/

import { Service } from 'egg'
import { forOwn } from 'lodash'

export default class ExceptionService extends Service {
  // 异常黑名单
  private exceptionBlacklist = [ 'AppFlowException', 'ValidationException' ]

  /**
   * 处理异常通知
   */
  public async handler (error: any) {
    const { ctx, config } = this

    // 不管什么错误，都应该记录错误到 log 中
    ctx.logger.error(error)

    // 判断是否开启
    if (config.myApps.exception_notify.is_open !== 1) {
      return
    }

    // 判断当前异常是否存在黑名单中，如果存在，就不发送，这是为了避免一些手动抛出异常也会被通知，这没必要
    if (this.exceptionBlacklist.includes(error.name)) {
      return
    }

    // 判断通知类型
    switch (config.myApps.exception_notify.type) {
      case 1:
        return this.wechatNotify(error)
      case 2:
        return this.emailNotify(error)
      default:
        // 啥也不干，，
    }
  }

  /**
   * 微信通知
   */
  public async wechatNotify (error: any) {
    const { ctx, config } = this

    // 获取访问 ip 的地址信息
    const region = await ctx.handlers.ipToRegion.search()

    // 微信模板消息需要的数据
    let templateData: any = {
      // 应用名称
      name: config.myApps.appName,
      // 异常路由
      router: ctx.request.href,
      // 触发 IP
      ip: ctx.ip,
      // 触发地区
      region: `${region.region} - ${region.province}${region.city} - ${region.isp}`,
      // 异常类型
      type: error.name,
      // 异常时间
      time: new Date().toLocaleString(),
      // 异常信息
      stack: error.stack
    }

    // 组装数据
    forOwn(templateData, (value, key) => {
      templateData[key] = {
        value: value,
        color: '#f5222d'
      }
    })

    return new Promise(() => {
      // 发送模板信息
      ctx.handlers.wechat.templateMessage.send({
        touser: config.myApps.exception_notify.wechat_opt.touser,
        template_id: config.myApps.exception_notify.wechat_opt.template_id,
        data: templateData
      }).catch(error => {
        // 如果发送成功，那么就应该记录下异常信息
        ctx.logger.error(`${error}`)
      })
    })
  }

  /**
   * 邮件通知
   */
  public async emailNotify (error: any) {
    const { ctx, config } = this

    // 获取访问 ip 的地址信息
    const region = await ctx.handlers.ipToRegion.search()

    // docs: https://nodemailer.com/message/
    // 发送人名称
    const from = `${config.myApps.appName} <${config.myApps.mail_options.auth.user}>`
    // 接收邮件地址
    const to = config.myApps.exception_notify.email_opt.to
    // 邮件主题
    const subject = `${config.myApps.appName} 异常信息`
    // html 邮件内容
    const html = `<table style="width: 80vw; margin: 20px auto; background: #fff; box-shadow: 0px 2px 18px 0 rgba(122, 135, 142, 0.33); border-radius: 10px;font-size: 14px; line-height: 1.5; color: rgba(0, 0, 0, 0.55); padding: 10px 15px;"><tbody><tr style="width: 100%;"><td style="width: 80px; padding: 6px 0px; ">应用名称:<td style="margin: 20px; color: #1890ff">${config.myApps.appName}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常路由:<td style="margin: 20px; color: #1890ff">${ctx.request.href}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">触发 IP:<td style="margin: 20px; color: #1890ff">${ctx.ip}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">触发地区:<td style="margin: 20px; color: #1890ff">${region.region} - ${region.province}${region.city} - ${region.isp}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常类型:<td style="margin: 20px; color: #1890ff">${error.name}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常时间:<td style="margin: 20px; color: #1890ff">${new Date().toLocaleString()}<tr style="border-bottom: 1px solid #e8e8e8; width: 100%; padding: 16px 0px;"><td style="padding: 6px 0px;">异常信息:<td style="margin: 20px; color: #1890ff; white-space: pre; display: block;">${error.stack}</table>`

    return new Promise(() => {
      ctx.handlers.mail.sendMail({
        from,
        to,
        subject,
        html
      }).catch(error => {
        // 如果发送成功，那么就应该记录下异常信息
        ctx.logger.error(`${error}`)
      })
    })
  }
}
