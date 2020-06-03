/* eslint-disable @typescript-eslint/indent */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 缓存管理
|
*/

// eslint-disable-next-line import/no-extraneous-dependencies
import { Redis } from 'ioredis';
import { isEmptyByAllTypes, isEmpty } from '../Utils';


type unitType = 'h' | 'm' | 's' | 'ms';

export class Cache {
  // 使用缓存类型
  private readonly store: Redis;

  private readonly prefixName: string;

  constructor(storeInstance: Redis, prefixName: string) {
    this.store = storeInstance;
    this.prefixName = prefixName;
  }

  /**
   * 给缓存标识添加 prefix 前缀
   *
   * @param {string} key 缓存标识
   *
   * @returns {string}
   */
  getPrefixKey(key: string): string {
    return `${this.prefixName}.${key}`;
  }

  /**
   * 设置字符串类型缓存
   *
   * @param {string} key 缓存标识
   * @param {any}    value 缓存的数据
   * @param {number} time 缓存过期时间
   * @param {string} unit 指定时间单位 （h/m/s/ms）默认为 s
   */
  async set(
    key: string,
    value: any,
    time = 0,
    unit: unitType = 's',
  ) {
    let t = Number(time);

    if (isEmptyByAllTypes(key) || isEmpty(value) || Number.isNaN(t)) {
      return this.abortError('请传入正确参数');
    }

    // 为了能传入 object、array 这类的值，所以这里转换成 json
    const data = JSON.stringify(value);
    let un = unit;

    if (t) {
      // 转换为小写
      un = un.toLowerCase() as unitType;

      // 判断时间单位
      switch (un) {
        case 'h':
          t *= 3600;
          break;
        case 'm':
          t *= 60;
          break;
        case 's':
          break;
        case 'ms':
          break;
        default:
          return this.abortError('时间单位只能是：h/m/s/ms');
      }

      // EX: 单位为秒; PX: 单位为毫秒
      const mill = un === 'ms' ? 'PX' : 'EX';

      return this.store.set(this.getPrefixKey(key), data, mill, t);
    }

    // 不设置过期时间
    return this.store.set(this.getPrefixKey(key), data);
  }

  /**
   * 获取缓存
   *
   * @param {string} key 缓存标识
   * @param {any} def 当缓存不存在的时候, 返回的默认值
   */
  async get(key: string, def: any = null) {
    if (isEmptyByAllTypes(key)) {
      return this.abortError('请传入需要获取的缓存名称');
    }

    try {
      const result = await this.store.get(this.getPrefixKey(key));

      // 因为上面加储存值转换为 json, 所以这里需要把它转换回来
      return result ? JSON.parse(result) : def;
    } catch (error) {
      await this.abortError('get 方法只能获取 string 类型缓存');
    }
  }

  /**
   * 判断缓存是否存在
   *
   * @param {string} key
   * @returns {boolean} 是否存在
   */
  async has(key: string): Promise<boolean> {
    return !isEmpty(await this.get(key));
  }

  /**
   * 删除指定缓存
   *
   * @param {string} key 缓存标识
   */
  async del(key: string) {
    if (isEmptyByAllTypes(key)) {
      return this.abortError('请传入需要删除的缓存名称');
    }

    return this.store.del(this.getPrefixKey(key));
  }

  /**
   * 在列表右端插入数据(插入缓存列表尾部), 当缓存不存在的时候，一个空缓存会被创建并执行 rpush 操作
   *
   * @param key
   * @param value
   */
  async pushListAfter(key: string, value: any) {
    return this.store.rpush(this.getPrefixKey(key), value);
  }

  /**
   * 在列表左端插入数据 (插入到缓存列表头部)
   *
   * @param key
   * @param value
   */
  async pushListTop(key: string, value: any) {
    return this.store.lpush(this.getPrefixKey(key), value);
  }

  /**
   * rpushx 只对已存在的队列做添加, 当缓存不存在时，什么也不做
   *
   * @param key
   * @param value
   */
  async rPushX(key: string, value: any) {
    return this.store.rpushx(this.getPrefixKey(key), value);
  }

  /**
   * 返回并移除缓存队列的第一个元素
   *
   * @param key
   */
  async rmListTop(key: string) {
    return this.store.lpop(this.getPrefixKey(key));
  }

  /**
   * 返回并移除缓存队列的最后一个元素
   *
   * @param key
   */
  async rmListAfter(key: string) {
    return this.store.rpop(this.getPrefixKey(key));
  }

  /**
   * 查看缓存队列长度
   *
   * @param key
   */
  async getListLen(key: string) {
    return this.store.llen(this.getPrefixKey(key));
  }

  /**
   * 获取缓存列表中指定顺序位置的元素
   *
   * @param key
   * @param index 索引值
   */
  async getListIndex(key: string, index: number) {
    return this.store.lindex(key, index);
  }

  /**
   * 修改缓存列表中指定顺序位置的元素值
   *
   * @param key
   * @param index
   * @param value
   */
  async setListValue(key: string, index: number, value: any) {
    return this.store.lset(key, index, value);
  }

  /**
   * 抛出 cache 异常
   *
   * @param {number} code 错误状态码
   * @param {string} message 错误提示
   *
   * @throws {Error}
   */
  async abortError(message = 'error', code = 422) {
    const error: any = new Error(`[cache]: ${message}`);
    error.status = code;
    error.name = 'CacheException';

    throw error;
  }
}
