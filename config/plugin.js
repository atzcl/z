'use strict';

// 挂载 egg-jwt
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

// 挂载 egg-sequelize
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

// 挂载 egg-router-plus 路由拓展
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

// 挂载 egg-validate 数据验证
exports.validate = {
  package: 'egg-validate',
};

// 挂载 egg-redis redis 拓展
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// 挂载 egg-session-redis 将 session 储存到 redis
exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};

// 挂载 egg-socket.io
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};
