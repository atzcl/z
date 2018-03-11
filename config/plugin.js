'use strict';

// 挂载 egg-jwt
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
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
