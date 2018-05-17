/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 通过 ip 获取地址信息
|
*/

import BaseHandler from './base_handler';

// ip2region 地址库
import * as IP2Region from 'ip2region';

export default class IpToRegion extends BaseHandler {
  /**
   * 传入 ip 查询地址信息
   *
   * @param {string} ip 搜索的 ip
   */
  public async search (ip?: string) {
    ip = ip || (this.ctx.ip as string);

    return (new IP2Region()).search(ip);
  }
}
