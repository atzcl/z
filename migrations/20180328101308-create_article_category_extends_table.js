'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, BOOLEAN } = Sequelize;
    await db.createTable('article_category_extends', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_category_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 article_category_id 表 id',
      },
      title: {
        type: STRING(255),
        allowNull: false,
        comment: '标题',
      },
      description: {
        type: STRING(255),
        allowNull: true,
        comment: '描述',
      },
      thumb: {
        type: STRING(200),
        allowNull: true,
        comment: '封面',
      },
      small_thumb: {
        type: STRING(200),
        allowNull: true,
        comment: '缩略图封面',
      },
      seo_title: {
        type: STRING(100),
        allowNull: true,
        comment: 'seo 标题',
      },
      seo_description: {
        type: STRING(200),
        allowNull: true,
        comment: 'seo 描述',
      },
      seo_keywords: {
        type: STRING(200),
        allowNull: true,
        comment: 'seo 关键词',
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
          fields: [ 'article_category_id' ],
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
    await db.dropTable('article_category_extends');
  },
};
