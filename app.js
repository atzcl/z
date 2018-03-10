'use strict';

// 监听应用启动
module.exports = app => {
  // 加载自定义 Loader
  require('./app/lib/loader')(app);
};
