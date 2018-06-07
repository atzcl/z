/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| 模块路由入口 [ egg-router-plus 好像无法识别 ts 文件，所以将该文件设置为 js ]
|
*/

module.exports = (app) => {
  const { controller, router } = app;

  router.get('/', controller.index.home);

  // 扫码登录页面
  router.get('/login', controller.index.index);

  /*****************************  模块路由 ********************************/

  // 模块基础路径
  const moduleBaseDir = '../modules';

  // wechat 模块
  require(`${moduleBaseDir}/wechat/routes`)(app);

  // user 模块
  require(`${moduleBaseDir}/user/routes`)(app);

  // admin 模块
  require(`${moduleBaseDir}/admin/routes`)(app);

  // socket.io
  require('../io/routes')(app);
};
