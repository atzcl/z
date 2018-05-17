
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 处理登录、注册、密码重置的 service 基类
|
*/

import { createHash } from 'crypto';
import { Service } from 'egg';
import * as moment from 'moment';

export default abstract class AuthService extends Service {
  // 返回指定 repository 层实例
  // 并需要在 repository 中实现 getUserInfo、createUser、getUserByEmail 方法
  abstract get repository (): any

  // 返回指定的重置密码的路由
  abstract get restPasswordRoute (): string

  // 返回指定的激活账号的路由
  abstract get activeAccountRoute (): string

  // 返回储存重置密码邮件 token 的 repository 层实例
  public get passwordResetRepository () {
    return this.ctx.userRepository.userPasswordReset;
  }

  // 定义用户登录类型，这里是以账号为登录依据
  public get username (): string[] {
    return [ 'name', this.ctx.request.body.name ];
  }

  /**
   * 处理登录
   *
   * @throws {Error}
   * @returns {object}
   */
  public async handleLogin () {
    const { ctx, app } = this;

    // 查询用户详情
    const result: any = await this.repository.getUserInfo(...this.username);

    if (result) {
      // 判断密码是否一致
      if (await app.verifyBcrypt(ctx.request.body.password, result.password)) {
        // 删除密码属性
        delete result.password;

        return result;
      }
    }

    ctx.abort(422, '账号或者密码错误');
  }

  /**
   * 处理注册
   *
   * @throws {Error}
   * @returns {object}
   */
  public async handleRegister () {
    const { ctx } = this;

    // 创建用户
    const result: any = await this.repository.createUser();

    if (result) {
      // 返回创建结果
      return result;
    }

    ctx.abort(500, '注册失败~');
  }

  /**
   * 发送激活账号邮件
   *
   * @throws {Error}
   * @returns {object}
   */
  public async handleActiveAccountEmail (email: string, result: any) {
    // 生成 token
    const token = await this.createRestPasswordToken(email);

    // 储存 email、token 到密码重置表
    if (await this.passwordResetRepository.createToken(email, token)) {
      // 发送激活邮件
      return this.ctx.service.mail.sendResetPassMail(
        email,
        result.name,
        `${this.activeAccountRoute}?name=${result.name}&token=${token}`,
      );
    }

    this.ctx.abort(500, '发送激活邮件失败');
  }

  /**
   * 发送重置密码邮件
   *
   * @throws {Error}
   * @returns {object}
   */
  public async handleSendPasswordResetEmail (email: string) {
    // 获取 emial 的请求
    const result = await this.repository.getUserByEmail(email);

    if (result) {
      // 生成 token
      const token = await this.createRestPasswordToken(email);

      // 储存 email、token 到密码重置表
      if (await this.passwordResetRepository.createToken(email, token)) {
        // 发送邮件
        return this.ctx.service.mail.sendResetPassMail(
          email,
          result.name,
          `${this.restPasswordRoute}?name=${result.name}&token=${token}`,
        );
      }
    }

    this.ctx.abort(422, '邮箱不正确或者不存在');
  }

  /**
   * 验证 token 跟邮件是否有效
   * @param {string} email
   * @param {string} password
   */
  public async verifyRestPasswordToken (email: string, token: string) {
    const result = await this.passwordResetRepository
        .where({ email, token })
        .orderBy('created_at')
        .first();

    if (!result) {
      return this.ctx.abort(422, '无效的重置行为');
    }

    // 判断该重置记录是否还在有限期内，24 小时内有效
    const isOverTime = (moment().unix() - moment(result.created_at).unix()) > (1000 * 60 * 60 * 24);

    if (!result.created_at || isOverTime) {
      return this.ctx.abort(422, '该链接已失效，请重新发起');
    }
  }

  /**
   * 创建加密 token
   *
   * @param {string} value 加密内容
   */
  public async createRestPasswordToken (value: string) {
    return createHash('md5')
          .update(value + moment().unix() + this.config.keys)
          .digest('hex');
  }

  /**
   * 重置密码
   *
   * @param {string} name 账号
   * @param {string} password 密码
   */
  public async handleUpdatePassword (name: string, password: string) {
    return this.repository.updatePassword(name, password);
  }
}
