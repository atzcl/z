/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 工具类
|
*/

import { createHash, createHmac } from 'crypto';
import { Builder, parseString } from 'xml2js';
import * as UUIDV4 from 'uuid/v4';

/**
 * 生成 MD5
 *
 * @param value 加密的值
 */
export const md5 = (value: string | Buffer | DataView) => createHash('md5').update(value).digest('hex');

export const sha256 = (
  str, key, encoding: 'utf8' | 'ascii' | 'latin1' = 'utf8',
) => createHmac('sha256', key).update(str, encoding).digest('hex');

export const toQueryString = (obj: object) => (
  Object.keys(obj)
    .filter((key: string) => key !== 'sign' && obj[key] !== undefined && obj[key] !== '')
    .sort()
    .map((key: string) => key + '=' + obj[key])
    .join('&')
);

export const uniqId = () => UUIDV4().replace(/-/g, '');

export const checkXML = (str: string) => (/^(<\?xml.*\?>)?(\r?\n)*<xml>(.|\r?\n)*<\/xml>$/i).test(str.trim());

export const buildXML = (obj: any, rootName = 'xml') => {
  const opt = { xmldec: null, rootName, allowSurrogateChars: true, cdata: true };

  return new Builder(opt).buildObject(obj);
};

export const parseXML = (xml: any) => (
  new Promise((resolve, reject) => {
    const opt = { trim: true, explicitArray: false, explicitRoot: false };

    parseString(xml, opt, (err, res) => err ? reject(new Error('XMLDataError')) : resolve(res || {}));
  })
);
