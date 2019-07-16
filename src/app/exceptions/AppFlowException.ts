/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 应用通用异常类
|
*/

import { BaseException } from './BaseException';


export class AppFlowException extends BaseException {
  constructor(message: string, code: number) {
    super('AppFlowException', code, message);
  }
}
