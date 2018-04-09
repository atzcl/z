
import { Service } from 'egg';

export default abstract class MailService extends Service {
  /**
   * 激活帐号邮件
   *
   * @param {string} toEmail 接收方
   * @param {string} name 账号名称
   * @param {string} url 携带密钥的重置 url
   */
  public async sendActiveAccountMail (toEmail: string, name: string, url: string) {
    const { config } = this;
    const appName = config.apps.appName;

    const from = `${appName} <${config.apps.mail_options.auth.user}>`;
    const to = toEmail;
    const subject = `${appName} 帐号激活`;
    const html = `<p>您好：${name} </p><p>我们收到您在 ${appName} 帐号激活的请求，请在 24 小时内单击下面的链接来帐号激活：</p><a href="${config.apps.appUrl}${url}">帐号激活链接</a><p>若您没有在 ${appName} 填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p><p>${appName} 谨上。</p>`;

    await this.ctx.handlers.mail.sendMail({
      from,
      to,
      subject,
      html,
    });
  }

  /**
   * 重置密码邮件
   *
   * @param {string} toEmail 接收方
   * @param {string} name 账号名称
   * @param {string} url 携带密钥的重置 url
   */
  public async sendResetPassMail (toEmail: string, name: string, url: string) {
    const { config } = this;
    const appName = config.apps.appName;

    const from = `${appName} <${config.apps.mail_options.auth.user}>`;
    const to = toEmail;
    const subject = `${appName} 密码重置`;
    const html = `<p>您好：${name} </p><p>我们收到您在 ${appName} 重置密码的请求，请在 24 小时内单击下面的链接来重置密码：</p><a href="${config.apps.appUrl}${url}">重置密码链接</a><p>若您没有在 ${appName} 填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p><p>${appName} 谨上。</p>`;

    await this.ctx.handlers.mail.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}
