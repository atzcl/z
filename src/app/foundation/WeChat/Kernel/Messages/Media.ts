/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 媒体相关
|
*/


import { isObject } from 'util';

import { camelCase, upperFirst } from 'lodash';

import { Message, MessageMediaType } from './Message';


export class Media extends Message {
  requireds = ['media_id'];

  constructor(
    mediaId: string,
    type: MessageMediaType | null = null,
    attributes: any = {},
  ) {
    super({ media_id: mediaId, ...((isObject(attributes) && attributes) || {}) });

    if (type) {
      this.setType(type);
    }
  }

  /**
   * 获取媒体 id
   */
  getMediaId() {
    this.checkRequiredAttributes();

    return this.getAttribute('media_id');
  }

  /**
   * 需要转化成 xml 的 object 对象
   *
   * @returns {object}
   */
  toXmlObject() {
    // 转为 media_id => MediaId
    return {
      [upperFirst(camelCase(this.getType()))]: {
        MediaId: this.getMediaId(),
      },
    };
  }
}
