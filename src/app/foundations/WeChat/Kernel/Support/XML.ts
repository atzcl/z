/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 简单构造回复给微信的 XML 信息
|
*/

import { isNumber, isObject } from 'util';

import { parseString } from 'xml2js';


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class XML {
  /**
   * 解析 xml
   *
   * @param {string} xml
   *
   * @returns {any}
   */
  static parse(xml: string) {
    return new Promise((resolve, reject) => {
      const opt = { trim: true, explicitArray: false, explicitRoot: false };

      parseString(xml, opt, (err, res) => (err ? reject(new Error('XMLDataError')) : resolve(res || {})));
    });
  }

  /**
   * 判断是否为 xml 格式
   *
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser
   *
   * @param {string} str
   */
  static parserCheck(str: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(str, 'text/xml');

    // @see https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86
    const error = xmlDoc.getElementsByTagName('parsererror');

    return error.length > 0;
  }

  /**
   * 判断是否为 xml 格式
   *
   * @param {string} str
   */
  static check(str: string) {
    return (/^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/ui).test(str.trim());
  }

  /**
   * 转义为 xml
   *
   * @param {any}  data
   * @param {string} root
   * @param {string} item
   * @param {string} attr
   * @param {string} id
   *
   * @return string
   */
  // eslint-disable-next-line max-params
  static build(data: object, root = 'xml', item = 'item', attr = '', id = 'id') {
    if (String(attr) === '[object Object]') {
      //
    }

    const xmlContent = this.data2Xml(data, item, id);

    return `<${root}${attr}>${xmlContent}</${root}>`;
  }

  /**
   *
   *
   * @param {object} data
   * @param {string} [item='item']
   * @param {string} [id='id']
   * @returns {string}
   */
  static data2Xml(data: object, item = 'item', id = 'id') {
    let xml = '';
    let attr = '';

    for (const [key, val] of Object.entries(data)) {
      if (isNumber(key) && id) {
        // eslint-disable-next-line no-useless-escape
        attr = ` ${id}=\"${key}\"`;
      }

      xml += `<${key}${attr}>`;

      if (isObject(val)) {
        xml += this.data2Xml(val, item, id);
      } else {
        xml += isNumber(val) ? val : this.cdata(val);
      }

      xml += `</${key}>`;
    }

    return xml;
  }

  /**
   * 生成 cdata
   *
   * @param {string} string
   *
   * @returns {string}
   */
  static cdata(str: string) {
    return `<![CDATA[${str}]]>`;
  }
}
