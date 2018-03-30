import { Application } from 'egg'
import { DefineAttributes } from 'sequelize'

/**
 * 模型基类，可以在这里定义全局使用的作用域、hook、必要的字段定义
 *
 * @param {object} app 传入的 egg 的 Application 对象
 * param {string} table 表名
 * param {object | string} attributes 定义表的字段数据
 * param {object} options 模型的相关配置
 */
export const BaseModel = (app: Application, table: string, attributes: DefineAttributes, options?: object) => {
  const { INTEGER, Op } = app.Sequelize

  // 设置默认数据
  const modelSchema = app.model.define(table, {
    id: {
      type: INTEGER, // 类型: 整型
      primaryKey: true, // 主键
      autoIncrement: true // 自增
    },
    ...attributes
  }, {
    // 自动维护时间戳 [ created_at、updated_at ]
    timestamps: true,
    // 不使用驼峰样式自动添加属性，而是下划线样式 [ createdAt => created_at ]
    underscored: true,
    ...options,
    scopes: {
      // 定义全局作用域，使用方法如: .scope('onlyTrashed') or .scope('onlyTrashed1', 'onlyTrashed12') [ 多个作用域 ]
      onlyTrashed: {
        // 只查询软删除数据
        where: {
          deleted_at: {
            [Op.not]: null
          }
        }
      }
    }
  })

  /**
   * @returns {string[]} 获取定义的所有字段属性
   */
  modelSchema.getAttributes = (): string[] => {
    return Object.keys(attributes)
  }

  /**
   * @returns {string} 获取定义的指定字段属性的值
   */
  modelSchema.findAttribute = (attribute: string): object | undefined => {
    return (attributes as any)[attribute]
  }

  return modelSchema
}

// 导出 ts 声明
export interface BaseModel {
  id: number
  created_at: number
  updated_at: number
}
