import { controller, get, provide, inject, Context, post } from 'midway';
import { CaptchaCaptchaService, captchaCaptchaServiceProvideName } from '@my_modules/captcha/services/captcha';

@provide()
@controller('/captchas')
export class CaptchaController {
  @inject(captchaCaptchaServiceProvideName)
  service: CaptchaCaptchaService;

  // 根据传入的验证码 token，来获取缓存的验证码，然后生成图片，以流的方式输出
  @get('/:token')
  async show(ctx: Context) {
    ctx.set({ 'Content-type': 'image/jpeg' });

    // 输出验证码
    ctx.body = this.service.createCaptcha(
      await this.service.getCacheCaptchaValue(ctx.params.token),
    );
  }

  // 获取验证码 token
  @post('/token')
  async captchaToken(ctx: Context) {
    // todo: 后面可以考虑节流来限制刷新次数
    const token = await this.service.setCaptchaToken(
      await this.service.generateCaptchaCode(),
    );

    ctx.helper.toResponse(200, token);
  }
}
