'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // 加密 cookie 的 key
  config.keys = appInfo.name + '_1520352654717_4348';

  // 中间件配置
  config.middleware = [ 'exceptions' ];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  //
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

  // egg-jwt 额外配置
  config.jwt_extra = {
    iss: 'iss', // 令牌的签发者
    iat: 'iat', // 令牌的发布时间 (unix时间戳）
    exp: 'exp', // 令牌失效日期 (unix时间戳）
    nbf: 'nbf', // 令牌从什么时候可用的时间 (unix时间戳)
    ttl: 'ttl', // token 过期时间
    refresh_ttl: '', // token 可刷新的时间 []
    sub: 'sub', // 令牌标识 [ 也就是存放我们自己数据的地方 ]
    jti: 'jti', // 令牌的唯一标识符 （ sub 和 iat md5 加密后的字符）
  };

  return config;
};
