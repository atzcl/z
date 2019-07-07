/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 素材管理异常类
|
*/

import { BaseException } from './BaseException';

export class MaterialException extends BaseException {
  constructor(code: number, message: string) {
    super('MaterialException', code, message);
  }
}
