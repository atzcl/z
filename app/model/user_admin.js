"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
module.exports = (app) => {
    const { STRING, BOOLEAN } = app.Sequelize;
    // 创建模型
    const modelSchema = model_1.BaseModel(app, 'user_admin', {
        name: { type: STRING(32), unique: true, allowNull: false, comment: '用户名', },
        email: { type: STRING(64), unique: true, allowNull: true, comment: '邮箱地址', },
        phone: { type: STRING(20), unique: true, allowNull: true, comment: '手机号码', },
        status: { type: BOOLEAN, allowNull: false, defaultValue: 1, comment: '用户状态: 1 正常； 0 禁用', },
        password: { type: STRING(255), allowNull: false, comment: '密码', }
    }, {
        // 开启软删除
        paranoid: true
    });
    /**
     * @returns {array} 可批量赋值的数组
     */
    modelSchema.fillable = () => {
        return [
            'name',
            'email',
            'phone',
            'password'
        ];
    };
    /**
     * @returns {array} 输出数据时，隐藏字段数组
     */
    modelSchema.hidden = () => {
        return [
            'password'
        ];
    };
    // 监听 Sequelize 的创建之前的 hook 钩子行为 [ 即事件 ]
    modelSchema.beforeCreate(async (columns, options) => {
        // 加密密码
        columns.password = await app.createBcrypt(columns.password);
    });
    return modelSchema;
};
