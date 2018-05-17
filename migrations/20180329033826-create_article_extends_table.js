'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { STRING, TEXT, BOOLEAN, UUID, UUIDV4 } = Sequelize;
    await db.createTable('article_extends', {
      id: {
        type: UUID, // 类型: 整型
        primaryKey: true, // 主键
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      article_id: {
        type: UUID,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 article 表 id',
      },
      title: {
        type: STRING(255),
        allowNull: false,
        comment: '标题',
      },
      body: {
        type: TEXT,
        allowNull: true,
        comment: '内容',
      },
      excerpt: {
        type: STRING(255),
        allowNull: true,
        comment: '简要描述',
      },
      slug: {
        type: STRING(255),
        allowNull: true,
        comment: '翻译标题，用于 url seo、美化',
      },
      source_author: {
        type: STRING(40),
        allowNull: true,
        comment: '来源作者',
      },
      source_link: {
        type: STRING(255),
        allowNull: true,
        comment: '来源地址',
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
          fields: [ 'article_id' ],
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
    await db.dropTable('article_extends');
  },
};
