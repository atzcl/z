"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理 JWT 相关方法
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
const base_handler_1 = require("../base_class/base_handler");
class Jwt extends base_handler_1.default {
    /**
     * 获取加密 token
     *
     * @param {object} sub token 的标识（默认为用户标识）
     */
    async createJWT(sub) {
        return this.app.jwt.sign({ sub: sub }, this.app.config.jwt.secret);
    }
    /**
     * 获取 JWT 解密数据
     *
     * @param {string} $token JWT token
     * @return {any} Promise 对象
     */
    async decodeJWT(token) {
        return this.app.jwt.decode(token);
    }
}
exports.default = Jwt;
