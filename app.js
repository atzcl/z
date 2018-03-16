'use strict';

// 监听应用启动
module.exports = app => {
  // 加载自定义 Loader
  require('./app/lib/loader')(app);

  // 自动根据 model 定义自动生成数据表
  // if (app.config.env === 'local') {
  //   app.beforeStart(async () => {
  //     await app.model.sync({ force: true });
  //   });
  // }
};
