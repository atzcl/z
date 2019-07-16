/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| CaptchaController
|
*/

import { controller, get, provide, inject, post } from 'midway';
import { CaptchaService, SERVICE_PROVIDE } from '@app/modules/Captcha/Services/Captcha';
import { Controller } from '@app/foundation/Bases/BaseController';

@provide()
@controller('/captchas')
export class CaptchaController extends Controller {
  constructor(
    @inject(SERVICE_PROVIDE) private readonly service: CaptchaService,
  ) {
    super();
  }

  // 根据传入的验证码 token，来获取缓存的验证码，然后生成图片，以流的方式输出
  @get('/:token')
  async show() {
    this.ctx.set({ 'Content-type': 'image/jpeg' });

    // 输出验证码
    this.ctx.body = this.service.createCaptcha(
      await this.service.getCacheCaptchaValue(this.ctx.params.token),
    );
  }

  // 获取验证码 token
  @post('/token')
  async captchaToken() {
    // todo: 后面可以考虑节流来限制刷新次数
    const token = await this.service.setCaptchaToken(
      await this.service.generateCaptchaCode(),
    );

    this.ctx.helper.toResponse(200, token);
  }
}
