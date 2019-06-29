/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 简单构造回复给微信的 XML 信息
|
*/

import { isNumber, isObject } from 'util';
import { parseString } from 'xml2js';

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

      parseString(xml, opt, (err, res) => err ? reject(new Error('XMLDataError')) : resolve(res || {}));
    });
  }

  /**
   * 判断是否为 xml 格式
   *
   * @param {string} str
   */
  static check(str: string) {
    return (/^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/i).test(str.trim());
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
    let attr: string = '';

    for (const [ key, val ] of Object.entries(data)) {
      if (isNumber(key) && id) {
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
