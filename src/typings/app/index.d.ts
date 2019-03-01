import { Redis }  from 'ioredis';
import { VerifyOptions, Secret, SignOptions, DecodeOptions } from 'jsonwebtoken';

import { customizeConfig } from '../../config/config.default'

declare module 'egg' {
  // 拓展 egg 的 app 对象
  export interface Application {
    // jwt
    // jwt: any;
    redis: Redis;
    appDir: string;
  }

  interface EggAppConfig {

    io: typeof customizeConfig['io'];
    jwt: typeof customizeConfig['jwt'];
    myApp: typeof customizeConfig['myApp'];
    wechat: typeof customizeConfig['wechat'];
    sequelize: typeof customizeConfig['sequelize'];
  }

  // 拓展 egg 的 Router 对象
  export interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }
}
