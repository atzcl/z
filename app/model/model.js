"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 模型基类，可以在这里定义全局使用的作用域、hook、必要的字段定义
 *
 * @param {object} app 传入的 egg 的 Application 对象
 * @param {string} table 表名
 * @param {object|string} attributes 定义表的字段数据
 * @param {object} options 模型的相关配置
 */
exports.BaseModel = (app, table, attributes, options) => {
    const { INTEGER } = app.Sequelize;
    // 设置默认数据
    const modelSchema = app.model.define(table, Object.assign({ id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        } }, attributes), Object.assign({ 
        // 自动维护时间戳 [ created_at、updated_at ]
        timestamps: true, 
        // 不使用驼峰样式自动添加属性，而是下划线样式 [ createdAt => created_at ]
        underscored: true }, options));
    return modelSchema;
};
