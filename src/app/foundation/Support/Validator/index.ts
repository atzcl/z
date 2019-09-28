/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证类
|
*/

import AsyncValidator, { Rules as ValidationRules, ValidateOption } from 'async-validator';

import CNLang from './lang/cn';


export {
  ValidationRules,
  ValidateOption,
}

export type ValidatorLang = 'cn' | 'en';

/**
 * @see https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/src/messages.js
 */
const langOptions = {
  en: {},

  cn: CNLang,
};

export class Validator {
  validatorInstance: AsyncValidator;

  constructor(rules: ValidationRules, lang: keyof typeof langOptions = 'cn') {
    const validator = new AsyncValidator(rules);

    // 挂载语言信息
    (validator as any).messages(langOptions[lang] || langOptions.cn);

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
  validate(source: object, options: ValidateOption = {}) {
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
  validateSync(source: object, options: ValidateOption = {}, callback: (errors: any[]) => any = () => {}) {
    this.validatorInstance
      .validate(source, options, callback);
  }
}
