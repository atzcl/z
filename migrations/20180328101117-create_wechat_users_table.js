'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, BOOLEAN, DATE, STRING, BIGINT } = Sequelize;
    await db.createTable('wechat_users', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        references: {
          // 关联表
          model: 'users',
          // 关联外键
          key: 'id',
        },
        comment: '关联 users 表 id',
      },
      group_id: {
        type: BIGINT(20),
        allowNull: true,
        comment: '分组ID',
      },
      tagid_list: {
        type: STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '标签 id',
      },
      is_back: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为黑名单用户',
      },
      subscribe: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 1,
        comment: '用户是否订阅该公众号，0：未关注，1：已关注',
      },
      open_id: {
        type: STRING(150),
        allowNull: false,
        unique: true,
        comment: '用户的标识，对当前公众号唯一',
      },
      app_id: {
        type: STRING(200),
        allowNull: true,
        comment: '该微信用户所属公众号的 app_id'
      },
      nickname: {
        type: STRING(255),
        allowNull: false,
        defaultValue: '',
        comment: '用户的昵称',
      },
      sex: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知',
      },
      country: {
        type: STRING(60),
        allowNull: true,
        comment: '用户所在国家',
      },
      province: {
        type: STRING(60),
        allowNull: true,
        comment: '用户所在省份',
      },
      city: {
        type: STRING(60),
        allowNull: true,
        comment: '用户所在城市',
      },
      language: {
        type: STRING(30),
        allowNull: false,
        defaultValue: 'zh_CN',
        comment: '用户的语言，简体中文为 zh_CN',
      },
      headimgurl: {
        type: STRING(500),
        allowNull: true,
        comment: '用户头像',
      },
      subscribe_time: {
        type: BIGINT(20),
        allowNull: true,
        comment: '用户关注时间，时间戳',
      },
      unionid: {
        type: STRING(150),
        allowNull: false,
        defaultValue: '',
        comment: '只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。',
      },
      remark: {
        type: STRING(100),
        allowNull: true,
        comment: '备注',
      },
      deleted_at: DATE, // 软删除时间
      created_at: DATE, // 创建时间
      updated_at: DATE, // 更新时间
    }, {
      indexes: [
        {
          method: 'BTREE',
          fields: [ 'user_id' ],
        },
        {
          method: 'BTREE',
          fields: [ 'openid' ],
        },
        {
          method: 'BTREE',
          fields: [ 'nickname' ],
        },
        {
          method: 'BTREE',
          fields: [ 'groupid' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('user_admins');
  },
};
