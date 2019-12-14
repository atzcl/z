/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 通过 ip 获取地址信息
|
*/

import * as IP2Region from 'ip2region';

// ip2region 地址库
export const Ip2Region = async (ip: string) => (new IP2Region()).search(ip)
