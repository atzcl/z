'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, BOOLEAN, DATE, STRING } = Sequelize;

    await db.createTable('users', {
      id: {
        type: INTEGER, // 类型: 整型
        primaryKey: true, // 主键
        autoIncrement: true, // 自增
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
      avatar: {
        type: STRING(150),
        allowNull: true,
        comment: '头像',
      },
      real_name: {
        type: STRING(30),
        allowNull: true,
        comment: '真实姓名',
      },
      signature: {
        type: STRING(255),
        allowNull: true,
        comment: '签名',
      },
      notify_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '消息通知个数',
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
      last_actived_at: DATE, // 最后活跃时间
      deleted_at: DATE, // 软删除时间
      created_at: DATE, // 创建时间
      updated_at: DATE, // 更新时间
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('users');
  },
};
