import AuthLogin from './admin/auth/login'
import AuthRegister from './admin/auth/register'

declare module 'egg' {
  // 拓展 egg 的 app.ctx
  export interface Context {
    repository: {
      admin: {
        auth: {
          login: AuthLogin,
          register: AuthRegister
        }
      }
    }
  }
}
