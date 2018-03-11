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

  // 拓展 egg 的 Router 对象
  export interface Router {
    // egg-router-plus 拓展的 namespace 用法声明
    namespace(prefix: string, ...middlewares: Function[]): Router
  }

  // 拓展 egg 的 app.helper 对象，导出项目编写的 Helper 给 TypeScript
  export interface IHelper {
    bcrypt(value: string, salt?: number): string
    checkBcrypt(value: string, hash: string): boolean
  }
}
