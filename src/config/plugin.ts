// 启用 ts 的 paths 路径映射 (路径别名)
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tsconfig-paths/register';


export default {
  // 挂载 egg-jwt
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },

  // 挂载 egg-redis redis 拓展
  redis: {
    enable: true,
    package: 'egg-redis',
  },

  // 挂载 egg-socket.io
  io: {
    enable: true,
    package: 'egg-socket.io',
  },

  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
};
