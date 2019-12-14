/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 工具类
|
*/

import { createHash, createHmac } from 'crypto';

import { Builder, parseString, OptionsV2 } from 'xml2js';
import * as UUIDV4 from 'uuid/v4';


type Sha256Encoding = 'utf8' | 'ascii' | 'latin1';

/**
 * 生成 MD5
 *
 * @param value 加密的值
 */
export const md5 = (value: string | Buffer | DataView) => createHash('md5').update(value).digest('hex');

export const sha256 = (str: string, key: string, encoding: Sha256Encoding = 'utf8') => (
  createHmac('sha256', key).update(str, encoding).digest('hex')
);

export const sha1 = (str: string) => createHash('sha1').update(str).digest('hex');

/**
 * 生成签名
 */
export const toQueryString = (obj: object) => (
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  Object.keys(obj)
    .filter((key: string) => key !== 'sign' && (obj as any)[key] !== undefined && (obj as any)[key] !== '')
    .sort()
    .map((key: string) => `${key}=${(obj as any)[key]}`)
    .join('&')
);

/**
 * 生成唯一的字符串
 *
 * @returns {void}
 */
export const uniqId = () => UUIDV4().replace(/-/ug, '');

/**
 * 判断是否是 xml
 *
 * @param {string} str 需要检查的 xml
 */
export const checkXML = (str: string) => (/^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/ui).test(str.trim());

/**
 * 生成 xml
 *
 * @param {object} obj 需要生成 xml 的字段
 * @param {string} rootName 根名称
 */
export const buildXML = (obj: any, rootName = 'xml') => {
  const opt: OptionsV2 & { allowSurrogateChars: boolean, } = {
    xmldec: undefined, rootName, allowSurrogateChars: true, cdata: true,
  };

  return new Builder(opt).buildObject(obj);
};

/**
 * 解析 xml
 *
 * @param {any} xml 需要解析的 xml 数据
 */
export const parseXML = (xml: any) => (
  new Promise((resolve, reject) => {
    const opt = { trim: true, explicitArray: false, explicitRoot: false };

    parseString(xml, opt, (err, res) => (err ? reject(new Error('XMLDataError')) : resolve(res || {})));
  })
);

export const isNumber = (val: any) => typeof val === 'number';
