/***************  home 模块  *********************/
import HomeIndex from './home/index'

/***************  home 模块  *********************/
import AdminLogin from './admin/auth/login'
import AdminRegister from './admin/auth/register'
import CategoryController from './admin/category'

/***************  wechat 模块  *********************/
import IndexController from './wechat'

declare module 'egg' {
  // 拓展 egg 的 app.controller 对象，导出项目编写的 Controller 给 TypeScript
  export interface IController {
    home: {
      index: HomeIndex
    },
    admin: {
      auth: {
        login: AdminLogin,
        register: AdminRegister
      },
      category: CategoryController
    },
    wechat: {
      index: IndexController
    }
  }
}
