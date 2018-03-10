import HomeIndex from './home/index'
import AdminLogin from './admin/auth/login'

declare module 'egg' {
  // 拓展 egg 的 app.controller 对象，导出项目编写的 Controller 给 TypeScript
  export interface IController {
    home: {
      index: HomeIndex
    },
    admin: {
      auth: {
        login: AdminLogin
      }
    }
  }
}