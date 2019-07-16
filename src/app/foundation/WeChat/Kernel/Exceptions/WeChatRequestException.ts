/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 请求异常类
|
*/

import { BaseException } from './BaseException';


export class WeChatRequestException extends BaseException {
  constructor(code: number, message: string) {
    super('WeChatRequestException', code, message);
  }
}
