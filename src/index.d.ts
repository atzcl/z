import { Redis }  from 'ioredis'
import { VerifyOptions, Secret, SignOptions, DecodeOptions } from 'jsonwebtoken'

// config 配置声明
export interface DefaultConfig {
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
    }
  };
  wechat: {
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

declare module 'egg' {
  // 拓展 egg 的 app 对象
  export interface Application {
    // 增加合并该项目的 config 声明
    config: EggAppConfig & DefaultConfig;
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
    createBcrypt(value: string, salt?: number): string;
    verifyBcrypt(value: string, hash: string): boolean;
  }

  // 拓展 egg 的 Context 对象
  export interface Context {
    // egg-validate 拓展的 validate 方法声明
    validate(rules: object, data?: object): void;
  }

  // 拓展 egg 的 Router 对象
  export interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router;
  }

  // 拓展 egg 的 app.helper 对象，导出项目编写的 Helper 给 TypeScript
  export interface IHelper {
    toResponse(ctx: Context, code: number, data: any, msg: string): void
    getDataValues(result: any):null | object
  }
}
