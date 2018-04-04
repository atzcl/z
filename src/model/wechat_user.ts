import { Application } from 'egg'
import { BaseModel } from './model'

module.exports = (app: Application) => {
  const { INTEGER, BIGINT, STRING, BOOLEAN } = app.Sequelize

  // 创建模型
  const modelSchema = BaseModel(app, 'wechat_users', {
    user_id: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '关联 users 表 id'
    },
    group_id: {
      type: BIGINT(20),
      allowNull: true,
      comment: '分组ID'
    },
    tagid_list: {
      type: STRING(100),
      allowNull: true,
      comment: '标签 id'
    },
    is_back: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: '是否为黑名单用户'
    },
    subscribe: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: 1,
      comment: '用户是否订阅该公众号，0：未关注，1：已关注'
    },
    open_id: {
      type: STRING(150),
      allowNull: false,
      unique: true,
      comment: '用户的标识，对当前公众号唯一'
    },
    app_id: {
      type: STRING(200),
      allowNull: true,
      comment: '该微信用户所属公众号的 app_id'
    },
    nickname: {
      type: STRING(255),
      allowNull: true,
      defaultValue: '',
      comment: '用户的昵称'
    },
    sex: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: '用户的性别，值为1时是男性，值为2时是女性，值为0时是未知'
    },
    country: {
      type: STRING(60),
      allowNull: true,
      comment: '用户所在国家'
    },
    province: {
      type: STRING(60),
      allowNull: true,
      comment: '用户所在省份'
    },
    city: {
      type: STRING(60),
      allowNull: true,
      comment: '用户所在城市'
    },
    language: {
      type: STRING(30),
      allowNull: true,
      defaultValue: 'zh_CN',
      comment: '用户的语言，简体中文为 zh_CN'
    },
    avatar: {
      type: STRING(500),
      allowNull: true,
      comment: '用户头像'
    },
    subscribe_time: {
      type: BIGINT(20),
      allowNull: true,
      comment: '用户关注时间，时间戳'
    },
    unionid: {
      type: STRING(150),
      allowNull: true,
      defaultValue: '',
      comment: '只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。'
    },
    remark: {
      type: STRING(100),
      allowNull: true,
      comment: '备注'
    }
  }, {
    // 开启软删除
    paranoid: true,
    // 获取器
    getterMethods: {
      tagid_list () {
        return JSON.parse((this as any).getDataValue('tagid_list'))
      }
    },
    // 修改器
    setterMethods: {
      // 微信传递回来的 tagid_list 为数组形式，所以这里转译下
      tagid_list (value: any) {
        (this as any).setDataValue('tagid_list', JSON.stringify(value))
      }
    }
  })

  return modelSchema
}

export interface WechatUser {
}
