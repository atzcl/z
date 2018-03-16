"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Auth 属下的验证
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
const base_validate_1 = require("../../base_class/base_validate");
class category extends base_validate_1.default {
    default() {
        let rule = {};
        // 根据不同的请求类型来返回不同的验证规则
        switch (this.ctx.request.method) {
            case 'POST':
            case 'PUT':
            case 'GET':
            case 'DELETE':
        }
        return rule;
    }
}
exports.default = category;
