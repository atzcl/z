import { Redis } from 'ioredis';
import ExtendApplication from '@app/extend/application';
import ExtendContext from '@app/extend/context';
import ExtendRequest from '@app/extend/request';
import ExtendHelper from '@app/extend/helper';

import ExtendConfig, { customizeConfig } from '@/config/config.default';


type NewExtendConfig = typeof ExtendConfig & typeof customizeConfig;


interface SocketIoRedisOptions {
  host: string;
  port: number;
  auth_pass: string;
  db: number;
}

declare module 'egg' {
  interface Application extends ExtendInterface<typeof ExtendApplication> {
    // jwt
    jwt: any;
    redis: Redis;
    appDir: string;
    config: EggAppConfig & NewExtendConfig;
  }

  interface EggAppConfig extends ExtendInterface<NewExtendConfig> {
    io: {
      iinit?: {
        wsEngine?: 'ws' | 'uws',
      },
      namespace: {
        [ k in string ]: {
          connectionMiddleware: string[],
          packetMiddleware: string[],
        }
      },
      redis?: SocketIoRedisOptions | SocketIoRedisOptions[],
    };
  }

  interface Context extends ExtendInterface<typeof ExtendContext> {
    //
  }

  interface Request extends ExtendInterface<typeof ExtendRequest> {
    //
  }

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IHelper extends ExtendInterface<typeof ExtendHelper> {
    //
  }

  interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }
}
