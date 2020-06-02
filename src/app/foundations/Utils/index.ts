import * as pinyin from 'pinyin-no-jieba';
import { v4 as UUIDV4 } from 'uuid';


export { pinyin }

/**
 * 简单取交集
 *
 * @param {Array<string | number>} source 源数据
 * @param {Array<string | number>} comparison 对比的数据
 *
 * @returns {Array<string | number>}
 */
export const intersection = (source: (string | number)[], comparison: (string | number)[]) => (
  comparison.filter(item => source.includes(item))
)

export const smallUUID = () => UUIDV4().replace(/-/ug, '');

/**
 * 自身属性中是否具有指定的属性（也就是是否有指定的键）
 */
export const hasOwnProperty = (obj: object, property: string) => Object.prototype.hasOwnProperty.call(obj, property);

/**
 * 判断是否是指定 js 数据类型
 *
 * @param {string} type 数据类型
 * @param {any} value 需要判断的值
 *
 * @returns {boolean}
 */
export const isType = <T>(type: string) => (value: any): value is T => (
  value !== null && Object.prototype.toString.call(value) === `[object ${type}]`
);

export const isFn = isType<(...args: any[]) => any>('Function');

// eslint-disable-next-line @typescript-eslint/unbound-method
export const isArr = Array.isArray || isType<unknown[]>('Array');

export const isObj = isType<object>('Object');

export const isStr = isType<string>('String');

export const isNum = isType<number>('Number');
