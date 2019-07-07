/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| message 常量
|
*/

import { XML } from '../Support/XML';

export enum MessageEnum {
  All = 'all',
  TEXT = 'text',
  IMAGE = 'image',
  VOICE = 'voice',
  VIDEO = 'video',
  SHORT_VIDEO = 'shortvideo',
  LOCATION = 'location',
  LINK = 'link',
  DEVICE_EVENT = 'device_event',
  DEVICE_TEXT = 'device_text',
  FILE = 'file',
  TEXT_CARD = 'text_card',
  TRANSFER = 'transfer',
  EVENT = 'event',
  MINIPROGRAM_PAGE = 'miniprogrampage',
}

export type MessageMediaType = 'video' | 'voice'
  | 'textcard' | 'shortvideo' | 'news' | 'music'
  | 'miniprogrampage' | 'media_id' | 'image';

export type MessageAllType = 'text' | 'location' | 'link'
  | 'file' | 'device_text' | 'device_event' | 'wxcard' | 'mpnews' | MessageMediaType;

export class Message {
  protected attributes: any = {};

  protected type: MessageAllType;

  protected id: number;

  protected to: string;

  protected from: string;

  protected properties: unknown;

  // 必须存在的字段
  protected requireds: string[] = [];

  constructor(attributes: any = {}) {
    this.setAttributes(attributes);
  }

  /**
   * 获取消息类型
   *
   * @returns {string}
   */
  getType() {
    return this.type;
  }

  /**
   * 设置消息类型
   *
   * @param {string} type
   */
  setType(type: MessageAllType) {
    this.type = type;
  }

  /**
   * 设置整个 attributes 属性
   *
   * @param {object} attributes
   *
   * @returns {this}
   */
  setAttributes(attributes: unknown = {}) {
    this.attributes = attributes;

    return this;
  }

  /**
   * 设置单个 attribute 属性
   *
   * @param {string} attribute
   * @param {any} value
   *
   * @returns {this}
   */
  setAttribute(attribute: string, value: any) {
    this.attributes[attribute] = value;

    return this;
  }

  /**
   * 获取单个 attribute 属性
   *
   * @param {string} attribute
   * @param {any} def
   *
   * @returns {any}
   */
  getAttribute(attribute: string, def: any = null) {
    return this.attributes[attribute] || def;
  }

  /**
   * 转译成 xml
   *
   * @param {unknown} [appends={}]
   * @param {boolean} [returnAsObject=false]
   *
   * @returns {xml | object}
   */
  transformToXml(appends: object = {}, returnAsObject = false) {
    const data = { MsgType: this.getType(), ...this.toXmlObject(), ...appends };

    return returnAsObject ? data : XML.build(data);
  }

  /**
   * 需要转化成 xml 的 object 对象
   *
   * @returns {object}
   */
  toXmlObject() {
    return {};
  }

  /**
   * 检测所需的属性都已经存在在 attributes 中
   */
  checkRequiredAttributes() {
    if (! this.requireds.length) {
      return;
    }

    for (const attribute of this.requireds) {
      if (! this.getAttribute(attribute)) {
        throw new Error(`${attribute} cannot be empty.`);
      }
    }
  }
}
