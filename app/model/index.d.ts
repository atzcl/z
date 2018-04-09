import { User } from './user'
import { UserAdmin } from './user_admin'
import { WechatUser } from './wechat_user'
import { Model, SequelizeStatic, Sequelize } from 'sequelize'
import { UserPasswordResets } from './user_password_reset';

declare module 'egg' {

    interface Application {
        Sequelize: SequelizeStatic
        model: Sequelize
    }

    // 拓展自有 model 的声明
    interface Context {
      model: {
        User: Model<User, {}>;
        UserAdmin: Model<UserAdmin, {}>;
        WechatUser: Model<WechatUser, {}>;
        UserPasswordReset: Model<UserPasswordResets, {}>;
      }
  }
}

// 拓展 sequelize model 对象
declare module 'sequelize' {
  interface Model<TInstance, TAttributes> {
    fillable(): string[];
    hidden(): string[];
    visible(): string[];
    getAttributes(): string[];
    findAttribute(attribute: string): object | undefined;
    /**
     * Get the value of the underlying data value
     */
    getDataValue(key: string): any;

    /**
     * Update the underlying data value
     */
    setDataValue(key: string, value: any): void;
  }
}
