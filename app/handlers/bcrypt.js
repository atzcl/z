"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 bcrypt 加密
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
const base_handler_1 = require("../base_class/base_handler");
const bcryptjs = require('bcryptjs');
class Bcrypt extends base_handler_1.default {
    /**
     * bcryptjs 加密
     *
     * @param {string} value 需要加密的值
     * @param {number} salt 加密的强度 0 - 12
     * @returns string
     */
    async createBcrypt(value, salt = 10) {
        return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt));
    }
    /**
     * 比对输入值与已加密值是否一致
     *
     * @param {string} value 输入值
     * @param {string} hash 已加密的 hash 值
     * @returns boolean
     */
    async verifyBcrypt(value, hash) {
        return bcryptjs.compareSync(value, hash);
    }
}
exports.default = Bcrypt;
