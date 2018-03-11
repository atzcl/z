"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
class LoginController extends base_1.default {
    async index() {
        this.ctx.service.home.index.index(await this.ctx.repository.admin.auth.login.getInfo());
    }
}
exports.default = LoginController;
