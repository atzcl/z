import { Redis }  from 'ioredis'
import ExtendHelper from './extend/helper'
import ExtendContext from './extend/context'
import ExtendApplication from './extend/application'
import { VerifyOptions, Secret, SignOptions, DecodeOptions } from 'jsonwebtoken'

import IndexController from './controller';

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
    createBcrypt: typeof ExtendApplication.createBcrypt;
    verifyBcrypt: typeof ExtendApplication.verifyBcrypt;
  }

  // 拓展 egg 的 Context 对象
  export interface Context {
    // egg-validate 拓展的 validate 方法声明
    validate: typeof ExtendContext.validate;
    abort: typeof ExtendContext.abort;
  }

  // 拓展 egg 的 Router 对象
  export interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }

  export interface IController {
    index: IndexController
  }

  // 拓展 egg 的 app.helper 对象，导出项目编写的 Helper 给 TypeScript
  export interface IHelper {
    parseMsg: typeof ExtendHelper.parseMsg;
    toResponse: typeof ExtendHelper.toResponse;
    getDataValues: typeof ExtendHelper.getDataValues;
    toSocketResponse: typeof ExtendHelper.toSocketResponse;
  }

    // 拓展 egg 的 EggAppConfig [ 将自定义的 config 加载在这里 ]
    export interface EggAppConfig {
      jwt: {
        secret: string,
        enable: boolean,
        match?: string
      };
      jwt_extra: {
        iss: string,
        iat: number,
        exp: number,
        nbf: number,
        ttl: number,
        refresh_ttl: number,
        sub: string,
        jti: string,
      };
      myApps: {
        appName: string,
        debug: boolean,
        appUrl: string,
        adminRouter: string,
        mail_options: {
          host: string,
          port: number,
          secure: boolean,
          auth: {
            user: string,
            pass: string
          }
        },
        exception_notify: {
          is_open: number
          type: number
          wechat_opt: {
            touser: string
            template_id: string
          },
          email_opt: {
            to: string
          },
        },
        modules_list: string[],
        admin_jwt_secret: string,
      };
      wechat: {
        base_uri: string
        app_id: string
        secret: string
        token: string
        aes_key: string
        mini_app_id: string
        mini_secret: string
        mini_token: string
        mini_aes_key: string
      }
    }
}
