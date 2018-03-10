"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 自定义辅助函数 [ egg 会自动加载合并到系统内置辅助函数中 ]
|
*/
const bcryptjs = require('bcryptjs');
/**
 * bcryptjs 加密
 *
 * @param string value 需要加密的值
 * @param number salt 加密的强度 0 - 12
 * @returns string
 */
exports.bcrypt = (value, salt = 10) => {
    return bcryptjs.hashSync(value, bcryptjs.genSaltSync(salt));
};
/**
 * 比对输入值与已加密值是否一致
 *
 * @param string value 输入值
 * @param string hash 已加密的 hash 值
 * @returns boolean
 */
exports.checkBcrypt = (value, hash) => {
    return bcryptjs.compareSync(value, hash);
};
exports.toResponse = (code, data, msg) => { };
