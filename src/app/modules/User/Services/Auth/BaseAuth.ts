/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| UserLogin
|
*/

import { Context, inject } from 'midway';
import PhoneRule from '@app/rules/Phone';
import { CaptchaService } from '@my_modules/Captcha/Services/Captcha';
import { BaseModel, BuildsQueries } from '@app/foundations/ORM/Model';


export abstract class BaseAuthService {
  @inject()
  ctx!: Context;

  @inject()
  captchaService!: CaptchaService;

  /**
   * 查询构造器实例
   *
   * @description 需要注意作用域问题，避免属性被污染 https://midwayjs.org/midway/ioc.html#%E9%85%8D%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F
   */
  protected queryBuilderInstance?: BuildsQueries;

  /**
   * 获取登录用户的模型
   *
   * @returns {UserModel}
   */
  abstract model(): typeof BaseModel

  /**
   * 创建查询构造器
   */
  makeQueryBuilder(): BuildsQueries {
    this.queryBuilderInstance = new BuildsQueries(this.model());

    return this.queryBuilderInstance;
  }

  /**
   * 获取查询构造器
   */
  queryBuilder(): BuildsQueries {
    return this.queryBuilderInstance || this.makeQueryBuilder();
  }

  // 验证登录数据
  validateLoginData() {
    const rules: any = {
      password: {
        required: true, type: 'string', min: 6, max: 64,
      },
    };

    // 根据登录类型，来返回验证条件
    switch (this.ctx.request.body.login_type) {
      case 'email':
        rules.email = { required: true, type: 'email' };
        break;
      case 'phone':
        rules.phone = { equired: true, type: 'string', ...PhoneRule };
        break;
      default:
        rules.username = {
          required: true, type: 'string', min: 4, max: 64,
        };
    }

    this.ctx.validate(rules);
  }

  /**
   * 验证验证码
   */
  async validateCaptcha() {
    this.ctx.validate({
      captcha_code: { required: true, type: 'string' },
      captcha_token: { required: true, type: 'string' },
    });

    const { captcha_token, captcha_code } = this.ctx.request.body;

    await this.captchaService.checkCaptcha(
      this.ctx.app.cache,
      captcha_token,
      captcha_code,
    );
  }

  /**
   * 登录之前
   *
   * @param {object} userInfo
   */
  beforeLogin() {
    //
  }

  /**
   * 登录成功之后
   *
   * @param {object} userInfo
   */
  afterLogin(userInfo: any) {
    return userInfo;
  }

  /**
   * 加密 token
   *
   * @param {object} encryptUserData 需要加密的用户数据
   *
   * @returns {string}
   */
  generateToken(encryptUserData: object) {
    return this.ctx.helper.jwt().create(encryptUserData);
  }

  /**
   * 执行登录操作
   *
   * @returns {object}
   */
  async handleLogin() {
    // 登录验证
    this.validateLoginData();

    // 验证验证码
    await this.validateCaptcha();

    // 登录之前，可以在这里拓展限制登录次数、增加验证方式：短信之类
    this.beforeLogin();

    const userInfo = await this.attemptLogin(this.ctx.request.body.password);

    // 登录之后的操作，比如给用户加积分之类的
    this.afterLogin(userInfo);

    return {
      ...this.outputUserData(userInfo),
      token: await this.generateToken(this.encryptUserData(userInfo)),
    };
  }

  /**
   * 获取登录类型
   *
   * @param {Context} ctx
   *
   * @returns {string}
   */
  getUserLoginType() {
    switch (this.ctx.request.body.login_type) {
      case 'email':
        return 'email';
      case 'phone':
        return 'phone';
      default:
        return 'username';
    }
  }

  /**
   * 尝试登录
   *
   * @returns {BaseModel}
   */
  async attemptLogin(password: string) {
    const userLoginType = this.getUserLoginType();

    // 查询用户信息
    const result = await this.queryBuilder()
      .where(userLoginType, this.ctx.request.body[userLoginType])
      .skipHidden()
      .first();

    // 判断是否存在该用户跟密码是否一致
    if (! result || ! this.ctx.helper.verifyBcrypt(password, result.password)) {
      this.ctx.abort(422, '账号或密码错误');
    }

    return result;
  }

  /**
   * 获取需要加密的数据
   *
   * @param {object} userInfo
   *
   * @returns {object}
   */
  encryptUserData(userInfo: any) {
    return {
      id: userInfo.id || '',
    };
  }

  /**
   * 获取输出到前端的数据
   *
   * @param {object} userInfo
   *
   * @returns {object}
   */
  outputUserData(userInfo: any) {
    return {
      id: userInfo.id || '',
      username: userInfo.username || '',
      name: userInfo.name || '',
      nickname: userInfo.nickname || '',
      avatar: userInfo.avatar || '',
    };
  }
}
