'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    await db.createTable('user_password_resets', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: STRING(64),
        allowNull: false,
        comment: '邮箱地址',
      },
      token: {
        type: STRING(255),
        allowNull: false,
        comment: '验证 token',
      },
      created_at: DATE,
    },
    {
      indexes: [
        {
          method: 'BTREE',
          fields: [ 'email' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('user_password_resets');
  },
};
