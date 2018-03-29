'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN } = Sequelize;
    await db.createTable('article_attachments', {
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
        comment: '关联 articles 表 id',
      },
      type: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '附件类型: 0 图片； 1 文件，可能更加细分为：音频、视频等',
      },
      title: {
        type: STRING(100),
        allowNull: true,
        comment: '附件标题',
      },
      thumb: {
        type: STRING(200),
        allowNull: true,
        comment: '附件封面',
      },
      description: {
        type: STRING(255),
        allowNull: true,
        comment: '描述',
      },
      path: {
        type: STRING(500),
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
    await db.dropTable('article_attachments');
  },
};
