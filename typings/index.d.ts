import { Redis }  from 'ioredis'
import ExtendHelper from './extend/helper'
import ExtendContext from './extend/context'
import ExtendApplication from './extend/application'
import { VerifyOptions, Secret, SignOptions, DecodeOptions } from 'jsonwebtoken'

declare module 'egg' {
  // 拓展 egg 的 app 对象
  export interface Application {
    // jwt
    jwt: {
      // 加密
      sign(
        payload: string | Buffer | object,
        secretOrPrivateKey: Secret,
        options?: SignOptions,
      ): string;

      // 验证
      verify(
        token: string,
        secretOrPublicKey: string | Buffer,
        options?: VerifyOptions,
      ): object | string;

      // 解密
      decode(
        token: string,
        options?: DecodeOptions,
    ): null | { [key: string]: any } | string;
    }
    redis: Redis;
  }

  // 拓展 egg 的 Router 对象
  export interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }
}
