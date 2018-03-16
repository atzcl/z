"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("../base_controller");
const validate_1 = require("../../../lib/decorator/validate");
class RegisterController extends base_controller_1.default {
    /**
     * 用户注册
     *
     * @returns void
     */
    async register() {
        // 创建用户
        const result = await this.ctx.repository.admin.auth.register.createUser();
        if (result) {
            await this.succeed(result.id);
            return;
        }
        this.ctx.throw(500, '注册失败~');
    }
}
__decorate([
    validate_1.validateBody('admin.auth.register')
], RegisterController.prototype, "register", null);
exports.default = RegisterController;
