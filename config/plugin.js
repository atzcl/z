'use strict';

// 挂载 egg-jwt
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

// 开启 egg-sequelize
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
