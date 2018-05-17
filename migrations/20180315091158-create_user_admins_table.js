'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { BOOLEAN, DATE, STRING, UUID, UUIDV4} = Sequelize;

    await db.createTable('user_admins', {
      id: {
        type: UUID, // 类型: 整型
        primaryKey: true, // 主键
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      name: {
        type: STRING(32), // varchar
        unique: true, // 唯一
        allowNull: false, // not null
        comment: '用户名',
      },
      email: {
        type: STRING(64),
        unique: true,
        allowNull: true, // null
        comment: '邮箱地址',
      },
      phone: {
        type: STRING(20),
        unique: true,
        allowNull: true,
        comment: '手机号码',
      },
      status: {
        type: BOOLEAN, // tinyint 类型
        allowNull: false,
        defaultValue: 1,
        comment: '用户状态: 1 正常； 0 禁用',
      },
      password: {
        type: STRING(255),
        allowNull: false, // not null
        comment: '密码',
      },
      deleted_at: DATE, // 软删除时间
      created_at: DATE, // 创建时间
      updated_at: DATE, // 更新时间
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('user_admins');
  },
};
