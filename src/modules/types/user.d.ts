import IndexController from "../wechat/controllers";
import LoginController from "../wechat/controllers/login";
import { WechatConfig } from "../wechat/config/app";
import LoginService from "../wechat/services/login";



// User 模块
declare namespace User {
  interface Controller {
    index: IndexController;
    login: LoginController;
  }

  interface Config {
    wechat: WechatConfig
  }

  interface Service {
    login: LoginService
  }

  interface Middleware {
  }

  interface Repository {
  }

  interface ValidateRule {
  }
}