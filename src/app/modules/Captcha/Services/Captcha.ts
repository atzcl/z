/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| CaptchaCaptcha
|
*/

import { provide, inject, Context } from 'midway';
import { Service } from '@/app/foundation/Bases/BaseService';
import Captcha from '@/app/foundation/Support/Captcha';
import * as dayjs from 'dayjs';

export const SERVICE_PROVIDE = 'captchaService';

@provide(SERVICE_PROVIDE)
export class CaptchaService extends Service {
  @inject()
  ctx: Context;

  // 验证码 token 缓存标识
  private readonly tokenCachePrefix = 'captcha:token:';

  /**
   * 生成验证码
   *
   * @param {string} code 需要绘制的验证码
   *
   * @returns {Buffer}
   */
  async createCaptcha(code: string) {
    const captchaBuilder = await (new Captcha()).captchaBuilder(code);

    return captchaBuilder.captchaData;
  }

  /**
   * 生成验证码值
   *
   * @returns {string}
   */
  async generateCaptchaCode() {
    return (new Captcha()).randomChars();
  }

  /**
   * 获取储存在缓存的验证码时间
   *
   * @param token
   */
  async getCacheCaptchaValue(token: string) {
    return this.ctx.helper.cache.get(this.tokenCachePrefix + token, '已失效');
  }

  /**
   * 获取填充完整的验证码缓存 key
   *
   * @param {string} cacheTokenKey
   *
   * @returns {string}
   */
  getFillFullCaptchaTokenKey(cacheTokenKey: string): string {
    return this.tokenCachePrefix + cacheTokenKey;
  }

  /**
   * 设置生成验证码 token
   *
   * @param {string} value 验证码内容
   * @param {number} expiredAt 验证码过期时间，单位： 分
   *
   * @return string
   */
  async setCaptchaToken(value: string, expiredAt: number = 2) {
    const helper = this.ctx.helper;

    // 后面还可以增加毫秒时间戳来保证唯一
    const cacheTokenKey = helper.strRandom() + dayjs().valueOf();

    // 将验证码保存到缓存中
    helper.cache.set(this.getFillFullCaptchaTokenKey(cacheTokenKey), value, expiredAt, 'm');

    return cacheTokenKey;
  }

  /**
   * 校验验证码 token 跟验证码的值
   *
   * @param {string} token
   * @param {string} value
   *
   * @throws
   */
  async checkCaptcha(token: string, value: string) {
    const cache = this.ctx.helper.cache;
    // 获取完整的 key 名称
    const fullCaptchaTokenKey = this.getFillFullCaptchaTokenKey(token);

    // 判断是否存在当前校验的验证码
    if (! await cache.has(fullCaptchaTokenKey)) {
      this.ctx.abort(404, '验证码不存在');
    }

    const result = (await cache.get(fullCaptchaTokenKey)).toLowerCase() === value.toLowerCase();

    // 无论是否一致，都清空当前的验证码缓存，这样避免一个验证码被多次猜解测试
    cache.del(fullCaptchaTokenKey);

    if (! result) {
      this.ctx.abort(400, '验证码不正确');
    }
  }
}
