"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../service");
class IndexService extends service_1.default {
    async index() {
        await this.succeed('Service 层输出');
    }
}
exports.default = IndexService;
