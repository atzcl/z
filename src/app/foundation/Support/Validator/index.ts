/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证类
|
*/

import * as AsyncValidator from 'async-validator';

import CNLang from './lang/cn';


export type ValidatorLang = 'cn' | 'en';

export type ValidateCallback = (errors: any[], fields: any[]) => void;

export interface ValidateOptions {
  first?: boolean;
  firstFields?: boolean | string[];
}

export interface AsyncValidator {
  validate(source: object, callbak?: ValidateCallback): Promise<any>;
  validate(
    source: object,
    options: ValidateOptions,
    callbak?: ValidateCallback,
  ): Promise<any>;
}

/**
 * @see https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/src/messages.js
 */
const langOptions = {
  en: {},

  cn: CNLang,
};

export class Validator {
  validatorInstance: AsyncValidator;

  constructor(rules: object, lang: keyof typeof langOptions = 'cn') {
    const validator = new AsyncValidator(rules);

    // 挂载语言信息
    validator.messages(langOptions[lang] || langOptions.cn);

    this.validatorInstance = validator;
  }

  /**
   * 校验数据
   *
   * @param {object} source 需要校验的数据
   * @param {ValidateOptions} options 校验的配置
   *
   * @returns {Promise<any>}
   */
  validate(source: object, options: ValidateOptions = {}) {
    return new Promise((resolve, reject) => {
      this.validatorInstance
        .validate(
          source,
          options,
          (error: any[]) => (error ? reject(error) : resolve()),
        );
    });
  }

  // 同步版本
  validateSync(source: object, options: ValidateOptions = {}, callback?: (errors: any[]) => any) {
    this.validatorInstance
      .validate(
        source,
        options,
        (error: any[]) => callback && callback(error),
      );
  }
}
