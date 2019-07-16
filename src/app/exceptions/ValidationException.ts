/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证异常类
|
*/

import { BaseException } from './BaseException';


export class ValidationException extends BaseException {
  constructor(message: string) {
    super('ValidationException', 422, message);
  }
}
