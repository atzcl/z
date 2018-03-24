'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // 加密 cookie 的 key
  config.keys = appInfo.name + '_1520352654717_4348';

  // 中间件配置
  config.middleware = [ 'exceptions' ];

  // 自定义配置，后面会抽离一部分存放到数据，提供在线修改
  config.myApps = {
    appName: 'z', // 应用名称
    debug: false, // 是否本地开发环境
    appUrl: 'xxx', // 应用的 url
    adminRouter: 'system', // 后台路由名称
    mail_options: {
      host: 'smtp.qq.com', // 地址
      port: 465, // 端口
      secure: true, // TLS 设置
      auth: {
        user: 'xxx', // 账号
        pass: 'xxx', // 密码 [授权码]
      },
    },
    exception_notify: {
      is_open: 0, // 是否打开异常通知，0 关闭；1 开启
      type: 1, // 异常通知类型，1 微信； 2 邮件；更多...
      wechat_opt: {
        touser: 'xxxx', // 接收通知的用户 open_id
        template_id: 'xxxx', // 模板消息的 id
      },
      email_opt: {
        to: 'xxxx@gmail.com', // 接收通知的用户邮件地址
      },
    },
  };

  // onerror 配置
  config.onerror = {
    all(err, ctx) {
      console.log(err, ctx);
    },
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
    database: 'xxxx', // 数据库名称
    host: '123.0.0.1', // 数据库地址
    port: '3306', // 数据库端口
    username: 'xxxx', // 用户名
    password: 'xxxx', // 密码
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
    define: {
      underscored: true,
      charset: 'utf8mb4',
    },
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
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/example': {
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

  config.wechat = {
    app_id: 'xxxx', // AppID
    secret: 'xxxx', // AppSecret
    token: 'xxxx', // Token
    aes_key: '', // EncodingAESKey
    // 小程序
    mini_app_id: 'xxxx', // AppID
    mini_secret: 'xxxx', // AppSecret
    mini_token: 'xxxx', // Token
    mini_aes_key: '', // EncodingAESKey
    base_uri: 'https://api.weixin.qq.com/cgi-bin/',
  };

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

  return config;
};
