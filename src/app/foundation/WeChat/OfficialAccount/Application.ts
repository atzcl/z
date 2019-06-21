/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import { BaseApplication } from '../Kernel/BaseApplication';
import { IWeChatRequestOptions } from '../Kernel/Request';

export class OfficialAccountApplication extends BaseApplication {

  constructor(options: IWeChatRequestOptions) {
    super(options, options as any);
  }
}
