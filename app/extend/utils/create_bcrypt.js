"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 bcrypt 加密
|
*/
module.exports = () => {
    return async function () {
    };
};
// import BaseHandler from '../base_class/base_handler'
// const bcryptjs = require('bcryptjs')
// export default class Bcrypt extends BaseHandler {
//   /**
//    * bcryptjs 加密
//    *
//    * @param {string} value 需要加密的值
//    * @param {number} salt 加密的强度 0 - 12
//    * @returns string
//    */
//   public async createBcrypt(value: string, salt: number = 10): Promise<string> {
//     return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt))
//   }
//   /**
//    * 比对输入值与已加密值是否一致
//    *
//    * @param {string} value 输入值
//    * @param {string} hash 已加密的 hash 值
//    * @returns boolean
//    */
//   public async verifyBcrypt(value: string, hash: string): Promise<boolean> {
//     return bcryptjs.compareSync(value, hash)
//   }
// }
