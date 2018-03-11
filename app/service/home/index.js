"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../service");
class IndexService extends service_1.default {
    async index(name = 'Service 层输出') {
        await this.succeed(name);
    }
}
exports.default = IndexService;
