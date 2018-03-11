import AuthLogin from './admin/auth'

declare module 'egg' {
  // 拓展 egg 的 app.ctx
  export interface Context {
    validateRule: {
      admin: {
        auth: AuthLogin
      }
    }
  }
}
