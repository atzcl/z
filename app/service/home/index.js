"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../service");
class IndexService extends service_1.default {
    async index() {
        const { ctx } = this;
        ctx.validate(ctx.validateRule.admin.auth.login());
        this.succeed('验证成功');
    }
}
exports.default = IndexService;
