'use strict';

import { EggAppConfig, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & CustomizeConfig>;

// app special config scheme
export interface CustomizeConfig {
  sourceUrl: string;
  middleware: string[];
  apps: {
    appName: string,
    debug: boolean,
    appUrl: string,
    adminRouter: string,
    language: string,
    language_type: object,
    mail_options: {
      host: string,
      port: number,
      secure: boolean,
      auth: {
        user: string,
        pass: string,
      },
    },
    exception_notify: {
      is_open: number
      type: number
      wechat_opt: {
        touser: string
        template_id: string,
      },
      email_opt: {
        to: string,
      },
    },
    modules_list: string[],
    admin_jwt_secret: string,
  };
  wechat: {
    base_uri: string
    app_id: string
    secret: string
    token: string
    aes_key: string
    mini_app_id: string
    mini_secret: string
    mini_token: string
    mini_aes_key: string,
  };
  jwt: {
    secret: string,
    enable: boolean,
    match?: string,
  };
  jwt_extra: {
    iss?: string,
    iat?: number,
    exp?: number,
    nbf?: number,
    ttl: number,
    refresh_ttl: number,
    sub?: string,
    jti?: string,
  };
  onerror: any;
  sequelize: any;
  redis: any;
  proxy: boolean;
  ejs: any;
}

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig> & CustomizeConfig;

  // 加密 cookie 的 key
  config.keys = appInfo.name + '_1523079355129_5023';

  // 中间件配置
  config.middleware = [ 'exceptions' ];

  // onerror 配置
  config.onerror = {
    // all(err, ctx) {
    //   console.log(err, ctx);
    // },
  };

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // egg-sequelize 配置
  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'z', // 数据库名称
    host: '127.0.0.1', // 数据库地址
    port: '3306', // 数据库端口
    username: 'root', // 用户名
    password: 'root', // 密码
    // 禁用日志; 默认值: console.log
    // logging: false,
    // 链接数据库时的可选参数
    dialectOptions: {
      charset: 'utf8mb4', // 字符集
      collate: 'utf8mb4_unicode_ci', // 校对集
      // 当在数据库中处理一个大数(BIGINT和DECIMAL)数据类型的时候，你需要启用这个选项(默认: false)
      supportBigNumbers: true,
      // 这个选项需要bigNumberStrings与 supportBigNumbers同时启用，强制把数据库中大数(BIGINT和DECIMAL)数据类型的值转换为javascript字符对象串对象返回。(默认:false)
      bigNumberStrings: true,
    },
    // 指定在调用 sequelize.define 时使用的选项
    define: {
      underscored: true, // 字段以下划线（_）来分割（默认是驼峰命名风格）
      charset: 'utf8mb4', // 字符集
    },
    timezone: '+08:00', // 东八时区
  };

  // redis 配置 [ 后面如果需要对某一业务进行缓存的时候，可以开启多实例来进行特定储存 ]
  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: '0',
    },
    agent: true,
  };

  // egg-socket.io 配置
  exports.io = {
    init: {
      init: {
        wsEngine: 'uws', // 使用 uws 来代替默认的 us
      },
    },
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/loginQrCode': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      auth_pass: '',
      db: 1,
    },
  };

  // 代理
  config.proxy = true;

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  // egg-jwt 配置
  config.jwt = {
    secret: 'KJq73FdB5guI9yc44BjPqT4bBWhUTyKV', // 密钥
    enable: true, // 开启
    match: '/jwt',
  };

  // jwt 额外配置
  config.jwt_extra = {
    ttl: 2 * 7 * 24, // token 过期时间,单位: 小时
    refresh_ttl: 4 * 7 * 24, // token 可刷新的时间 [失效时间] 单位: 小时
    // iss: 'atzcl', // 令牌的签发者
    // iat: 'iat', // 令牌的发布时间 (unix时间戳）
    // exp: 'exp', // 令牌失效日期 (unix时间戳）
    // nbf: 'nbf', // 令牌从什么时候可用的时间 (unix时间戳)
    // sub: 'sub', // 令牌标识 [ 也就是存放我们自己数据的地方 ]
    // jti: 'jti', // 令牌的唯一标识符 （ sub 和 iat md5 加密后的字符）
  };

  // egg-view 配置 (内置)
  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
  };

  // egg-ejs 配置
  config.ejs = {};

  // app 应用设置
  config.apps = {
    appName: 'z', // 应用名称
    debug: false, // 是否本地开发环境
    appUrl: 'https://xxxx.com', // 应用的 url
    adminRouter: 'system', // 后台路由名称
    language: 'cn', // 当前语言
    language_type: { // 语言列表，配合 language 当前语言来用于后面查询时，可以判断应该输出何种语言的数据
      cn: 0,
      en: 1,
    },
    mail_options: {
      host: 'smtp.qq.com', // 地址
      port: 465, // 端口
      secure: true, // TLS 设置
      auth: {
        user: 'xxx@qq.com', // 账号
        pass: 'xxxx', // 密码
      },
    },
    exception_notify: {
      is_open: 0, // 是否打开异常通知，0 关闭；1 开启
      type: 2, // 异常通知类型，1 微信； 2 邮件；更多...
      wechat_opt: {
        touser: 'xxxxx', // 接收通知的用户 open_id
        template_id: 'xxxxx', // 模板消息的 id
      },
      email_opt: {
        to: 'xxxxx', // 接收通知的用户邮件地址
      },
    },
    modules_list: [ 'admin', 'user', 'wechat' ], // 当前挂载的模块列表
    admin_jwt_secret: 'xxxxx', // admin 模块的 jwt 密钥
  };

  // 微信相关配置
  config.wechat = {
    app_id: 'xxxx', // AppID
    secret: 'xxxxx', // AppSecret
    token: 'atzcl.cn', // Token
    aes_key: '', // EncodingAESKey
    // 小程序
    mini_app_id: '', // AppID
    mini_secret: '', // AppSecret
    mini_token: '', // Token
    mini_aes_key: '', // EncodingAESKey
    // 基础 url
    base_uri: 'https://api.weixin.qq.com/cgi-bin/',
  };

  return config;
};
