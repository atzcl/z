/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| CaptchaCaptcha
|
*/

import { provide } from 'midway';
import * as dayjs from 'dayjs';
import { Service } from '@app/foundations/Bases/BaseService';
import { Captcha } from '@app/foundations/Support/Captcha';
import { Cache } from '@app/foundations/support/cache';
import Helper from '@app/extend/helper';


export const SERVICE_PROVIDE = 'captchaService';

@provide(SERVICE_PROVIDE)
export class CaptchaService extends Service {
  // 验证码 token 缓存标识
  private readonly tokenCachePrefix = 'captcha:token:';

  model() {
    return '' as any
  }

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
   * 获取储存在缓存的验证码时间
   *
   * @param {Cache} cache 缓存实例
   * @param token
   */
  async getCacheCaptchaValue(cache: Cache, token: string) {
    return cache.get(this.getFillFullCaptchaTokenKey(token), '已失效');
  }

  /**
   * 设置生成验证码 token
   *
   * @param {Cache} cache 缓存实例
   * @param {string} value 验证码内容
   * @param {number} expiredAt 验证码过期时间，单位： 分
   *
   * @return string
   */
  async setCaptchaToken(cache: Cache, value: string, expiredAt = 2) {
    // 后面还可以增加毫秒时间戳来保证唯一
    const cacheTokenKey = `${Helper.strRandom()}${dayjs().valueOf()}`;

    // 将验证码保存到缓存中
    cache.set(this.getFillFullCaptchaTokenKey(cacheTokenKey), value, expiredAt, 'm');

    return cacheTokenKey;
  }

  /**
   * 校验验证码 token 跟验证码的值
   *
   * @param {Cache} cache 缓存实例
   * @param {string} token
   * @param {string} value
   *
   * @throws
   */
  async checkCaptcha(cache: Cache, token: string, value: string) {
    // 获取完整的 key 名称
    const fullCaptchaTokenKey = this.getFillFullCaptchaTokenKey(token);

    // 判断是否存在当前校验的验证码
    if (! await cache.has(fullCaptchaTokenKey)) {
      this.abort(404, '验证码不存在');
    }

    const result = (await cache.get(fullCaptchaTokenKey)).toLowerCase() === value.toLowerCase();

    // 无论是否一致，都清空当前的验证码缓存，这样避免一个验证码被多次猜解测试
    cache.del(fullCaptchaTokenKey);

    if (! result) {
      this.abort(400, '验证码不正确');
    }
  }
}
