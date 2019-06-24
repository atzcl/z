import { Context } from 'egg';

export default {
  /**
   * 获取 egg loader 当前 helper 拓展时，注入的 BaseContextClass
   *
   * @param this
   */
  getContext(this: any): Context {
    return this;
  },

  bearerToken() {
    //
  },

  /**
   * 获取所有指定 or 全部输入数据对象
   *
   * @param {?string[]} keys 指定数据属性名称数组集合
   *
   * @returns {any}
   */
  all(keys?: string[]) {
    const { request } = this.getContext();
    const body = [ 'GET', 'HEAD' ].includes(request.method) ? this._query() : this._body();
    if (! keys || ! keys.length) {
      return body;
    }

    const results = {} as any;
    for (const [ key, value ] of Object.entries(body)) {
      if (keys.includes(key)) {
        results[key] = value;
      }
    }

    return results;
  },

  /**
   * 获取 body 某一项 or 全部数据
   *
   * @param {?string} key body 属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any | null}
   */
  _body(key?: string, def: any = null) {
    const { request } = this.getContext();

    return key
      ? request.body[key] || def
      : request.body;
  },

  /**
   * 设置 request body
   *
   * @param body body payload
   */
  setBody(body: any) {
    this.getContext().request.body = body;
  },

  /**
   * 从 url query 查询串中获取指定 or 全部值
   *
   * @param {?string} key query 属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any | null}
   */
  _query(key?: string, def: any = null) {
    /**
     * 这里默认使用 queries 而不是 query, 原因具体可以查看文档
     *
     * @see https://eggjs.org/zh-cn/basics/controller.html#queries
     */
    const result = this.retrieveItem('queries', key, def);

    // 因为 queries 会确保任何一个有值的 key, 都会是数组的形式，但是在真实的情况下，我们获取的 key 的值基本都是单一的
    // 所以这里再判断一下，如果获取的值为数组并且长度为一，那么就返回数组的值就好了
    return key && Array.isArray(result) && result.length === 1
      ? result[0] : result;
  },

  /**
   * 获取指定属性的值
   *
   * @param {string | string[]} keys 字段集合
   *
   * @return {object}
   */
  only(keys: string | string[]) {
    keys = this.transformArgToArray(keys);

    const results = {} as any;

    const input = this.all();

    for (const [ key, value ] of Object.entries(input)) {
      if (keys.includes(key)) {
        results[key] = value;
      }
    }

    return results;
  },

  /**
   * 获取除了指定值外的所有值
   *
   * @param {string[]} keys 字段集合
   *
   * @return {object}
   */
  except(keys: string | string[]) {
    keys = this.transformArgToArray(keys);

    const results = JSON.parse(JSON.stringify(this.all()));
    for (const [ key ] of Object.entries(results)) {
      if (keys.includes(key)) {
        delete results[key];
      }
    }

    return results;
  },

  /**
   * 判定请求中是否存在指定的值。如果请求中存在该值， has 方法返回 true
   * 如果传入的是一个数组， has 方法将判断在请求中，指定的值是否全部存在
   */
  has(keys: string | string[]) {
    keys = this.transformArgToArray(keys);

    const input = this.all();

    return keys.some((key: string) => !!input[key]);
  },

  /**
   * Set the value at the given offset.
   *
   * @param  string  $offset
   * @param  mixed  $value
   * @return void
   */
  offsetSet(offset: string, value: any) {
    this.getContext().request.body[offset] = value;
  },

  /**
   * Remove the value at the given offset.
   *
   * @param  string  $offset
   * @return void
   */
  offsetUnset(offset: string) {
    delete this.getContext().request.body[offset];
  },

  /**
   * async-validator validate
   *
   * @param  {Object} rules  - validate rule object, see [async-validator](https://github.com/yiminghe/async-validator)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   * @param {object} options 当验证到有一个不通过的验证规则，那么就停止继续校验
   *
   * erroe info: [ { message: 'username 必填', field: 'username' }, { message: 'password 必填', field: 'password' } ]
   */
  validate(rules: object, verifyData?: object, options = { firstFields: true, first: true }) {
    this.getContext()
      .validator(rules)
        .validate(
          verifyData || this._body(),
          options,
          (errors: any[], fields: any[]) => {
            if (errors) {
              this.getContext().customException('ValidationException', 400, errors[0].message);
            }
          },
        );
  },

  /**
   * 将传入值转换为数组
   *
   * @param {string | string[]} arg 需要转换的参数
   *
   * @returns {string[]}
   */
  transformArgToArray(arg: string | string[]) {
    return  Array.isArray(arg) ? arg : [ arg ];
  },

  /**
   * 从 request 中获取指定数据源的全部 or 指定项
   *
   * @param {'body' | 'queries'} source 数据源
   * @param {?string} key 获取的属性名称
   * @param {any} def 当指定项不存在的时候，返回的默认值
   *
   * @returns {any}
   */
  retrieveItem(source: 'body' | 'queries', key: string, def: any) {
    const { request } = this.getContext();
    const payload = request[source];

    return key
      ? payload[key] || def
      : payload;
  },
};
