import JWTHandler from './src/handlers/jwt_handler'

// config 配置声明
export interface DefaultConfig {
  jwt: {
    secret: string,
    enable: boolean,
    match?: string
  }
}

declare module 'egg' {
  // 拓展 egg 的 app 对象
  export interface Application {
    // 增加合并该项目的 config 声明
    config: EggAppConfig & DefaultConfig
    // jwt
    jwt: any
  }

  // 拓展 egg 的 app.ctx
  export interface Context {
    // 放置各类处理额外业务逻辑处理
    handlers: {
      jwtHandle: JWTHandler
    }
  }

  // 拓展 egg 的 app.helper 对象，导出项目编写的 Helper 给 TypeScript
  export interface IHelper {
    bcrypt(value: string, salt?: number): string
    checkBcrypt(value: string, hash: string): boolean
  }
  
  // 拓展 egg 的 app.controller 对象，导出项目编写的 Controller 给 TypeScript
  // export interface IController {
  // }

  // 拓展 egg 的 app.service 对象，导出项目编写的 Controller 给 TypeScript
  // export interface IService {
  // }
}
