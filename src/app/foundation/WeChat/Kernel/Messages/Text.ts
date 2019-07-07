/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 文本消息
|
*/

import { Message } from './Message';

export class Text extends Message {
  type = 'text' as 'text';

  constructor(content: string) {
    super({ content });
  }

  /**
   * 需要转化成 xml 的 object 对象
   *
   * @returns {object}
   */
  toXmlObject() {
    return {
      Content: this.getAttribute('content'),
    };
  }
}
