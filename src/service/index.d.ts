/***************  home 模块  *********************/
import HomeIndex from './home/index'


/***************  admin 模块  *********************/
import AdminAuth from './admin/auth'

declare module 'egg' {
  // 拓展 egg 的 app.service 对象，导出项目编写的 Controller 给 TypeScript
  export interface IService {
    home: {
      index: HomeIndex
    },
    admin: {
      auth: AdminAuth
    }
  }
}