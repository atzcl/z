/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 Request
|
*/

import { isString } from 'util';

import { Request } from 'midway';

import { Validator, ValidatorLang, ValidateOption, ValidationRules } from '../foundations/Support/Validator';
import { ValidationException } from '../exceptions/ValidationException';
import { BaseException } from '../exceptions/BaseException';
import { AppFlowException } from '../exceptions/AppFlowException';


export default {
  /**
   * 当前 ctx 的 Request 对象, 主要是为了能避免使用 (this as any) 的写法
   *
   * @returns {Request}
   */
  get self(): Request {
    return this as any;
  },

  /**
   * async-validator validate
   *
   * @param  {Object} rules  - validate rule object, see [async-validator](https://github.com/yiminghe/async-validator)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   * @param {object} options 当验证到有一个不通过的验证规则，那么就停止继续校验
   *
   * erroe info: [ { message: 'username 必填', field: 'username' }, { message: 'password 必填', field: 'password' } ]
   */
  validate(
    rules: ValidationRules,
    verifyData?: object,
    options: ValidateOption = { firstFields: true, first: true },
    lang: ValidatorLang = 'cn',
  ) {
    return (new Validator(rules, lang))
      .validate(
        verifyData || this.all(),
        options,
      ).catch((errors) => {
        throw new ValidationException(errors[0].message)
      });
  },

  /**
   * 获取 authorization 的 bearer token
   *
   * @returns {string}
   *
   * @throws {AppFlowException}
   */
  bearerToken() {
    const authorizationValue = this.self.get('authorization');
    if (authorizationValue && authorizationValue.length > 10) {
      return authorizationValue.split(' ')[1];
    }

    throw new AppFlowException('authorization bearer token empty', 422);
  },

  /**
   * 获取所有指定 or 全部输入数据对象
   *
   * @param {?string[]} keys 指定数据属性名称数组集合
   *
   * @returns {any}
   */
  all(keys?: string[]) {
    const body = ['GET', 'HEAD'].includes(this.self.method) ? this.formatQuery() : this._body();
    if (! keys || ! keys.length) {
      return body;
    }

    const results = {} as any;
    for (const [key, value] of Object.entries(body)) {
      if (keys.includes(key)) {
        results[key] = value;
      }
    }

    return results;
  },

  /**
   * 获取 body 某一项 or 全部数据
   *
   * @param {?string} key body 属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any | null}
   */
  _body(key?: string | string[], def: any = null) {
    return ! key
      ? this.self.body
      : (
        ! Array.isArray(key)
          ? this.self.body[key] || def
          : key.map(k => (this.self.body[k] || def))
      );
  },

  /**
   * 设置 request body
   *
   * @param body body payload
   */
  setBody(body: any) {
    this.self.body = body;
  },

  /**
   * 从 url query 查询串中获取指定 or 全部值
   *
   * @param {?string} key query 属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any | null}
   */
  _query(keys?: string | string[], def: any = null) {
    const get = (key?: string) => {
      /**
       * 这里默认使用 queries 而不是 query, 原因具体可以查看文档
       *
       * @see https://eggjs.org/zh-cn/basics/controller.html#queries
       */
      const result = this.retrieveItem('queries', key, def);

      // 因为 queries 会确保任何一个有值的 key, 都会是数组的形式，但是在真实的情况下，我们获取的 key 的值基本都是单一的
      // 所以这里再判断一下，如果获取的值为数组并且长度为一，那么就返回数组的值就好了
      return key && Array.isArray(result) && result.length === 1
        ? result[0]
        : result;
    }

    return ! keys || isString(keys)
      ? get(keys)
      : keys.map(k => get(k))
  },

  /**
   * 获取 _query 的所有结果并进行格式处理
   *
   * @returns {object}
   */
  formatQuery() {
    const result = this._query();
    for (const [key, val] of Object.entries(result)) {
      // 因为 queries 会确保任何一个有值的 key, 都会是数组的形式，但是在真实的情况下，我们获取的 key 的值基本都是单一的
      // 所以这里再判断一下，如果获取的值为数组并且长度为一，那么就返回数组的值就好了, 这样会更加自然、符合直觉
      if (Array.isArray(val) && val.length === 1) {
        result[key] = val[0];
      }
    }

    return result;
  },

  /**
   * 获取指定属性的值
   *
   * @param {string | string[]} keys 字段集合
   *
   * @return {object}
   */
  only(keys: string | string[]) {
    const newKeys = this.transformArgToArray(keys);

    const results = {} as any;

    const input = this.all();

    for (const [key, value] of Object.entries(input)) {
      if (newKeys.includes(key)) {
        results[key] = value;
      }
    }

    return results;
  },

  /**
   * 获取除了指定值外的所有值
   *
   * @param {string[]} keys 字段集合
   *
   * @return {object}
   */
  except(keys: string | string[]) {
    const newKeys = this.transformArgToArray(keys);

    const results = JSON.parse(JSON.stringify(this.all()));
    for (const [key] of Object.entries(results)) {
      if (newKeys.includes(key)) {
        delete results[key];
      }
    }

    return results;
  },

  /**
   * 判定请求中是否存在指定的值。如果请求中存在该值， has 方法返回 true
   * 如果传入的是一个数组， has 方法将判断在请求中，指定的值是否全部存在
   */
  has(keys: string | string[]) {
    const newKeys = this.transformArgToArray(keys);

    const input = this.all();

    return newKeys.some((key: string) => !! input[key]);
  },

  /**
   * Set the value at the given offset.
   *
   * @param  string  $offset
   * @param  mixed  $value
   * @return void
   */
  offsetSet(offset: string, value: any) {
    this.self.body[offset] = value;
  },

  /**
   * Remove the value at the given offset.
   *
   * @param  string  $offset
   * @return void
   */
  offsetUnset(offset: string) {
    delete this.self.body[offset];
  },

  /**
   * 将传入值转换为数组
   *
   * @param {string | string[]} arg 需要转换的参数
   *
   * @returns {string[]}
   */
  transformArgToArray(arg: string | string[]) {
    return Array.isArray(arg) ? arg : [arg];
  },

  /**
   * 从 request 中获取指定数据源的全部 or 指定项
   *
   * @param {'body' | 'queries'} source 数据源
   * @param {?string} key 获取的属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any}
   */
  retrieveItem(source: 'body' | 'queries', key?: string, def: any = null) {
    const payload = this.self[source];

    return key
      ? payload[key] || def
      : payload;
  },

  /**
   * 抛出自定义异常
   *
   * @throws {string} exceptionName
   */
  customException(exceptionName: string, exceptionCode: number, exceptionMessage: string) {
    throw new BaseException(exceptionName, exceptionCode, exceptionMessage);
  },
};
