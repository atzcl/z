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
class auth extends base_validate_1.default {
    // 注册验证
    register() {
        return {
            name: {
                required: true,
                type: 'string',
                min: 5,
                max: 32,
            },
            password: {
                required: true,
                type: 'password',
                compare: 're-password'
            }
        };
    }
    login() {
        return {
            name: {
                required: true,
                type: 'string',
                min: 5,
                max: 32,
            },
            password: {
                required: true,
                type: 'password'
            }
        };
    }
}
exports.default = auth;
