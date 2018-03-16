"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = require("../../../base_class/base_repository");
class RegisterRepository extends base_repository_1.default {
    /**
     * 定义 model
     */
    get model() {
        return this.ctx.model.UserAdmin;
    }
    /**
     * 创建用户
     */
    async createUser() {
        return await this.created();
    }
}
exports.default = RegisterRepository;
