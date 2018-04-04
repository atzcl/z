import { Application } from 'egg'
import { BaseModel } from './model'

module.exports = (app: Application) => {
  // const { INTEGER, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'slides', {
  }, {
    // 开启软删除
    paranoid: true
  })

  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
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

export interface Slides {
}
