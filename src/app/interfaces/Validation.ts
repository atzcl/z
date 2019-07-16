/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证类接口
|
*/

import { Context } from 'midway';


export interface ValidationInterface {
  /**
   * 验证规则
   *
   * @return {object}
   */
  rules(ctx: Context): object;

  /**
   * 错误提示
   *
   * @return {object}
   */
  messages?(): object;
}
