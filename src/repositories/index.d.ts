import AuthLogin from './admin/auth/login'

declare module 'egg' {
  // 拓展 egg 的 app.ctx
  export interface Context {
    repository: {
      admin: {
        auth: {
          login: AuthLogin
        }
      }
    }
  }
}
