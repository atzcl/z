import { Redis }  from 'ioredis';
import { VerifyOptions, Secret, SignOptions, DecodeOptions } from 'jsonwebtoken';

import ExtendContext from '@app/extend/context';
import ExtendRequest from '@app/extend/request';
import ExtendHelper from '@app/extend/helper';
import ExtendConfig, { customizeConfig } from '@/config/config.default';

type NewExtendConfig = typeof ExtendConfig & typeof customizeConfig;

declare module 'egg' {
  interface Application {
    // jwt
    // jwt: any;
    redis: Redis;
    appDir: string;
    config: EggAppConfig & NewExtendConfig;
  }

  interface EggAppConfig extends ExtendInterface<NewExtendConfig> {
    //
  }

  interface Context extends ExtendInterface<typeof ExtendContext> {
    //
  }

  interface Request extends ExtendInterface<typeof ExtendRequest> {
    //
  }

  interface IHelper extends ExtendInterface<typeof ExtendHelper> {
    //
  }

  interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }
}
