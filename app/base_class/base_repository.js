"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Repository 基类
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const egg_1 = require("egg");
class BaseRepository extends egg_1.BaseContextClass {
    /**
     * 通过在模型定义的 fillable 方法来过滤入库字段数据
     *
     * @returns {object}
     */
    async fill() {
        // 为了不对请求的数据造成污染，这样应该是储存比对符合的数据，然后返回调用者
        let result = {};
        // todo: 待实现避免恶意传递过大 body 数据，导致遍历耗时过长
        lodash_1.forOwn(this.ctx.request.body, (value, key) => {
            // 判断当前遍历的 key 是否存在在 model 定义的【可以批量赋值】的数组里
            if (this.model.fillable().includes(key)) {
                result[key] = value;
            }
        });
        return result;
    }
    /**
     * 创建数据
     */
    async created() {
        // 获取过滤后的请求数据
        let body = await this.fill();
        // 返回创建结果
        return await this.model.create(body);
    }
    async findByField(field, value) {
        let whereObj = {};
        whereObj[field] = value;
        return await this.model.findOne({ where: whereObj });
    }
}
exports.default = BaseRepository;
