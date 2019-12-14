/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 队列基类
|
*/

import { JobOptions } from 'bull'


export abstract class Job {
  public abstract async handle(data: any, options: JobOptions): Promise<void>
}
