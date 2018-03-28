import { Admin } from './admin'
import { User } from './user'
import { WeChat } from './wechat'

declare module 'egg' {
  export interface Application {
    modules: {
      controller: {
        admin: Admin.Controller;
        user: User.Controller;
        wechat: WeChat.Controller;
      },
      middleware: {
        admin: Admin.Middleware;
        user: User.Middleware;
        wechat: WeChat.Middleware;
      }
    }
  }

  export interface Context {
    adminService: Admin.Service;
    adminRepository: Admin.Repository;
    adminValidateRule: Admin.ValidateRule;

    userService: User.Service;
    userRepository: User.Repository;
    userValidateRule: User.ValidateRule;

    wechatService: WeChat.Service;
    wechatRepository: WeChat.Repository;
    wechatValidateRule: WeChat.ValidateRule;
  }
}