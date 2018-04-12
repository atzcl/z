/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 默认配置，后面可能会抽离一部分到数据库/缓存中去，达到可视化配置的目的
|
*/
import { EggAppConfig, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // 加密 cookie 的 key
  config.keys = appInfo.name + '_1523079355129_5023';

  // 安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };

  // egg-view 配置 (内置)
  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
  };

  // 自定义配置/未提供 .d.ts 文件的拓展配置
  const customizeConfig = {
    // 中间件配置
    middleware: [
      'exceptions',
    ],
    // redis 配置 [ 后面如果需要对某一业务进行缓存的时候，可以开启多实例来进行特定储存 ]
    redis: {
      client: {
        host: '127.0.0.1',
        port: 6379,
        password: '',
        db: '0',
      },
      agent: true,
    },
    // egg-sequelize 配置
    sequelize: {
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
    },
    // egg-socket.io 配置
    io: {
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
    },
    // egg-jwt 配置
    jwt: {
      secret: 'KJq73FdB5guI9yc44BjPqT4bBWhUTyKV', // 密钥
      enable: true, // 开启
      match: '/jwt',
    },
    // jwt 额外配置
    jwt_extra: {
      ttl: 2 * 7 * 24, // token 过期时间,单位: 小时
      refresh_ttl: 4 * 7 * 24, // token 可刷新的时间 [失效时间] 单位: 小时
      // iss: 'atzcl', // 令牌的签发者
      // iat: 'iat', // 令牌的发布时间 (unix时间戳）
      // exp: 'exp', // 令牌失效日期 (unix时间戳）
      // nbf: 'nbf', // 令牌从什么时候可用的时间 (unix时间戳)
      // sub: 'sub', // 令牌标识 [ 也就是存放我们自己数据的地方 ]
      // jti: 'jti', // 令牌的唯一标识符 （ sub 和 iat md5 加密后的字符）
    },
    // app 应用设置
    apps: {
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
    },
    // 微信相关配置
    wechat: {
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
    },
    // onerror 配置
    onerror: {
      // all(err, ctx) {
      //   console.log(err, ctx);
      // },
    },
    // 代理
    proxy: true,
    // egg-ejs 配置
    ejs: {},
  };

  return {
    ...config,
    ...customizeConfig,
  };
};
