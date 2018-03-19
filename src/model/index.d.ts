import { Model, SequelizeStatic, Sequelize } from 'sequelize'
import { UserAdmin } from './user_admin'

declare module 'egg' {

    interface Application {
        Sequelize: SequelizeStatic
        model: Sequelize
    }

    interface Context {
      model: {
        UserAdmin: Model<UserAdmin, {}>
      }
  }
}

// 拓展 sequelize model 对象
declare module 'sequelize' {
  interface Model<TInstance, TAttributes> {
    fillable(): string[],
    hidden(): string[],
    visible(): string[]
  }
}
