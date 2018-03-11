"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_repository_1 = require("../../../base_class/base_repository");
class LoginRepository extends base_repository_1.default {
    async getInfo() {
        return 'LoginRepository';
    }
}
exports.default = LoginRepository;
