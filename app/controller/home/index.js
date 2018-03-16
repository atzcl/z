"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base_controller");
class IndexController extends base_controller_1.default {
    async index() {
        this.ctx.validateRule.admin.auth.login();
        console.log('我是调用方');
        this.ctx.service.home.index.index();
    }
}
exports.default = IndexController;
