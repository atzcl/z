'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, DATE, BOOLEAN } = Sequelize;
    await db.createTable('articles', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_category_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 article_category 表 id',
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 users 表 id, 作者 id',
      },
      is_show: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 1,
        comment: '是否显示: 1 正常； 0 禁用',
      },
      is_top: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否置顶: 1 是； 0 否',
      },
      is_hot: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否热门: 1 是； 0 否',
      },
      is_good: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否精华: 1 是； 0 否',
      },
      is_draft: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否草稿状态: 1 是； 0 否',
      },
      reply_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '回复总数',
      },
      like_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '喜欢总数',
      },
      collect_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '收藏总数',
      },
      share_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '分享总数',
      },
      view_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '浏览总数',
      },
      order: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序',
      },
      last_reply_user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关联 users 表 id, 最后回复的 user id',
      },
      last_reply_at: DATE, // 最后回复的时间
      custom_time: DATE, // 自定义发布时间
      deleted_at: DATE, // 软删除时间
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
          fields: [ 'article_category_id' ],
        },
        {
          method: 'BTREE',
          fields: [ 'last_reply_user_id' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('articles');
  },
};
