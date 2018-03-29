'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN } = Sequelize;
    await db.createTable('article_images', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        references: {
          model: 'articles',
          key: 'id',
        },
        comment: '关联 article 表 id',
      },
      path: {
        type: STRING(200),
        allowNull: false,
        comment: '储存路径',
      },
      language_type: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '语言: 0 简体中文，其他看 config 配置',
      },
    },
    {
      indexes: [
        {
          method: 'BTREE',
          fields: [ 'article_id' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('article_images');
  },
};
