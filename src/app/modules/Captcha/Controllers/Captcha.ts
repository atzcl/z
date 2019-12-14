/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| CaptchaController
|
*/

import { controller, get, provide, inject, post } from 'midway';
import { CaptchaService, SERVICE_PROVIDE } from '@app/modules/Captcha/Services/Captcha';
import { Controller } from '@app/foundations/Bases/BaseController';

import { SkipPermissionCheck } from '@/app/foundations/Support/SkipPermissionCheck';


SkipPermissionCheck.addWildRoute('/captchas');

@provide()
@controller('/captchas')
export class CaptchaController extends Controller {
  @inject(SERVICE_PROVIDE)
  private readonly service!: CaptchaService;

  // 根据传入的验证码 token，来获取缓存的验证码，然后生成图片，以流的方式输出
  @get('/:token')
  async show() {
    this.ctx.set({ 'Content-type': 'image/jpeg' });

    const cacheCaptchaValue = await this.service
      .getCacheCaptchaValue(this.ctx.app.cache, this.ctx.params.token);

    // 输出验证码
    this.ctx.body = await this.service.createCaptcha(cacheCaptchaValue);
  }

  // 获取验证码 token
  @post('/token')
  async captchaToken() {
    // todo: 后面可以考虑节流来限制刷新次数
    const token = await this.service.setCaptchaToken(
      this.ctx.app.cache,
      await this.service.generateCaptchaCode(),
    );

    this.setStatusData(token).succeed();
  }
}
