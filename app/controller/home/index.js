"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class IndexController extends base_1.default {
    async index() {
        this.ctx.service.home.index.index();
    }
}
exports.default = IndexController;
