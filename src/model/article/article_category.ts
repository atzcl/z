import { Application } from 'egg'
import { BaseModel } from '../model'

module.exports = (app: Application) => {
  const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'categories', {
    name: { type: STRING(255), allowNull: false, comment: '分类名称' },
    pid: { type: INTEGER, allowNull: false, defaultValue: 0 },
    route: { type: STRING(255), allowNull: true, comment: '分类路由' },
    thumb: { type: STRING(255), allowNull: true, comment: '缩略图' },
    seo_title: { type: STRING(100), allowNull: true, comment: 'seo 标题' },
    seo_description: { type: STRING(200), allowNull: true, comment: 'seo 描述' },
    seo_keywords: { type: STRING(200), allowNull: true, comment: 'seo 关键词' },
    order: { type: INTEGER, defaultValue: 0, allowNull: false, comment: '排序' },
    is_show: { type: BOOLEAN, defaultValue: 1, allowNull: false, comment: '显示：1/隐藏：0' }
  }, {
    // 开启软删除
    paranoid: true
  })

  /**
   * @returns {array} 可批量赋值的数组
   */
  modelSchema.fillable = (): string[] => {
    return [
      'id'
    ]
  }

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  modelSchema.visible = (): string[] => {
    return [
      'id'
    ]
  }

  return modelSchema
}

export interface CategoryAdmin {
  name: string
  email?: string
  phone?: string
  status: number
  password: string
}
