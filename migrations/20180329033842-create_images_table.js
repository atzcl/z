'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN, DATE } = Sequelize;
    await db.createTable('images', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      path: {
        type: STRING(255),
        allowNull: false,
        comment: '存储路径',
      },
      title: {
        type: STRING(100),
        allowNull: false,
        comment: '文件名',
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 users 表 id, 创建用户的 id',
      },
      cdn_enabled: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否 CDN: 1 是； 0 否',
      },
      created_at: DATE, // 创建时间
      updated_at: DATE, // 更新时间
    },
    {
      indexes: [
        {
          method: 'BTREE',
          fields: [ 'user_id' ],
        },
        {
          method: 'BTREE',
          fields: [ 'title' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('images');
  },
};
