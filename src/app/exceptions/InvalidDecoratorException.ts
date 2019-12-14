/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 无效的装饰器异常
|
*/

import { BaseException } from '@app/exceptions/BaseException';

export class InvalidDecoratorException extends BaseException {
  constructor(message: string) {
    super('InvalidDecoratorItemException', 500, message);
  }
}
