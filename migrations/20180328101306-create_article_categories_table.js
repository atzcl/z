'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, JSON, BOOLEAN, DATE, UUID, UUIDV4 } = Sequelize;
    await db.createTable('article_categories', {
      id: {
        type: UUID, // 类型: 整型
        primaryKey: true, // 主键
        unique: true,
        allowNull: false,
        defaultValue: UUIDV4
      },
      parent_id: {
        type: UUID,
        allowNull: false,
        defaultValue: 0,
        comment: '父级 id',
      },
      parent_id_array: {
        type: JSON,
        allowNull: true,
        comment: '父级宗族谱 id',
      },
      is_show: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: 1,
        comment: '是否显示: 1 正常； 0 禁用',
      },
      order: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '排序',
      },
      created_at: DATE, // 创建时间
      updated_at: DATE, // 更新时间
    },
    {
      indexes: [
        {
          method: 'BTREE',
          fields: [ 'parent_id' ],
        },
      ],
    });
  },

  down: async db => {
    // 回滚
    await db.dropTable('article_categories');
  },
};
