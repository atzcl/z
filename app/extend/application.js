"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 bcrypt 加密 [ egg 会自动加载合并到全局 application 对象中 ]
|
*/
const bcryptjs = require('bcryptjs');
module.exports = {
    /**
     * bcryptjs 加密
     *
     * @param {string} value 需要加密的值
     * @param {number} salt 加密的强度 0 - 12
     * @returns string
     */
    async createBcrypt(value, salt = 10) {
        return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt));
    },
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
};
