// 使用 pm2 启动项目
module.exports = {
  apps: [
    {
      name      : 'app_1',
      script    : './node_modules/midway/server.js',
      node_args : '-r ./tsconfig-paths-bootstrap.js',
    }
  ]
};
