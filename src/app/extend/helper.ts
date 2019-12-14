/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 helper
|
*/

import { createHash } from 'crypto';
import * as path from 'path';
import { isObject } from 'util';

import { Context, EggAppConfig } from 'midway';
import * as dayjs from 'dayjs';
import * as bcryptjs from 'bcryptjs';
import * as UUIDV4 from 'uuid/v4';
import { random } from 'lodash';
import { JWT } from '@app/foundations/Support/Jwt';


interface LoopOrganizeDataAsTreeFormatProps<V extends any>{
  // 数据源
  dataSource: V[];
  // 上级节点的数据, 默认为 0
  pid?: number | string;
  // 主键的字段名称
  pkField?: string;
  // name 的字段名称
  nameField?: string;
  // 上级节点的字段名称
  pidField?: string;
  // 下级数据的字段名称
  childrenField?: string;
  // 自定义格式回调
  customFormatCallback?: (data: V) => V;
}

export default {
  /**
   * 获取 egg loader 当前 helper 拓展时，注入的 BaseContextClass
   *
   * @param this
   */
  get _context(): Context {
    return (this as any).ctx;
  },

  /**
   * jwt 辅助函数
   */
  jwt(options: EggAppConfig['jwt'] | any = {}) {
    const { app } = this._context;
    const { config } = app;

    return new JWT(
      // 防止 typeorm 扫描报错
      (app as any).jwt,
      { ...config.jwt, ...options },
      // 防止 typeorm 扫描报错
      (app as any).cache,
    );
  },

  /**
   * 响应返回
   *
   * @param { number } total 如果是分页返回的话，应该加上 count 总页数数据
   *
   * @returns { object }
   */
  toResponse(code: number, data: any, msg = 'success') {
    const response = {
      code,
      data,
      msg,
      time: dayjs().unix(),
    };

    // 响应返回
    this._context.response.body = response;
  },

  /**
   * bcryptjs 加密
   *
   * @param {string} value 需要加密的值
   * @param {number} salt 加密的强度 0 - 12
   *
   * @returns string
   */
  createBcrypt(value: string, salt = 10): string {
    return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt));
  },

  /**
   * 比对输入值与已加密值是否一致
   *
   * @param {string} value 输入值
   * @param {string} hash 已加密的 hash 值
   *
   * @returns boolean
   */
  verifyBcrypt(value: string, hash: string): boolean {
    return bcryptjs.compareSync(value, hash);
  },

  /**
   * 生成 MD5
   *
   * @param value 加密的值
   */
  generateMD5(value: string | Buffer | DataView) {
    return createHash('md5')
      .update(value)
      .digest('hex');
  },

  /**
   * 转化为分
   */
  amountToPoints(amount: number) {
    return Number(amount) * 100;
  },

  // 转化为真实金额
  getAmountByPoints(amount: number) {
    return Number(amount) / 100;
  },

  // 生成不带
  generateNotHorizontalLineOfUUID() {
    return UUIDV4().replace(/-/ug, '');
  },

  /**
   * 生成唯一随机字符串
   */
  generateUniqId() {
    return this.generateMD5(UUIDV4());
  },

  /**
   * 生成唯一订单号
   */
  generateOrderNo() {
    return dayjs().format('YYYYMMDDHHmmssSSS') + this.strRandom(13, 'number');
  },

  /**
   * 生成随机字符串
   *
   * @param {string} len 字符长度
   * @param {string} type 生成的类型
   *
   * @returns {string}
   */
  strRandom(len = 16, type: 'string' | 'number' | 'all' = 'all') {
    const number = '0123456789';
    // todo: 去掉了某些特殊的字符, 后面可以参考加上
    const letter
      = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let chars = '';
    switch (type) {
      case 'number':
        chars = number;
        break;
      case 'string':
        chars = letter;
        break;
      default:
        chars = letter + number;
        break;
    }

    let strValue = '';
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < len; index++) {
      strValue += chars[random(0, chars.length - 1)];
    }

    return strValue;
  },

  /**
   * 验证上传文件的格式
   *
   * @param {string} filename 上传的文件名
   * @param {string[]} [whitelist=[]] 上传文件的格式白名单
   */
  checkUploadFileExt(filename: string, whitelist: string[] = []) {
    let realWhitelist = whitelist;
    if (realWhitelist.length === 0) {
      realWhitelist = this._context.config.myApp.uploadExtWhiteList;
    }

    if (! realWhitelist.includes(path.extname(filename).toLowerCase())) {
      this._context.abort(400, `当前文件: ${filename} 的格式不符合要求`);
    }
  },

  /**
   * 安全的JSON.parse
   */
  safeJsonParse(data: any = ''): object {
    if (isObject(data)) {
      return data;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      return {}
    }
  },

  /**
   * 将一维数组转化为树形结构
   *
   * @param {LoopOrganizeDataAsTreeFormatProps<any>} props 配置项
   */
  loopConvertOneDimensionalArrayIntoTree<V extends any>({
    dataSource = [],
    pid = 0,
    pkField = 'id',
    nameField = 'name',
    pidField = 'parent_id',
    childrenField = 'children',
    customFormatCallback,
  }: LoopOrganizeDataAsTreeFormatProps<V>) {
    // 创建数据
    const tree = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < dataSource.length; index++) {
      let item = dataSource[index];

      if (item[pidField] === pid) {
        if (customFormatCallback) {
          // 自定义格式
          item = customFormatCallback(item)
        } else {
          item.value = item[pkField];
          item.label = item[nameField];
        }

        // 剔除已命中的数据，减少内存使用
        dataSource.splice(index, index);

        item[childrenField] = ! dataSource.length
          ? []
          : (
            this.loopConvertOneDimensionalArrayIntoTree({
              dataSource, pid: item[pkField], nameField, pidField, pkField, childrenField,
            })
          );

        // 储存到数组
        tree.push(item);
      }
    }

    return tree;
  }
};
