import IndexController from "../wechat/controllers";
import LoginController from "../wechat/controllers/login";
import { WechatConfig } from "../wechat/config/app";
import WechatUserService from "../wechat/services/wechat_user";
import WeChatUserRepository from "../wechat/repositories/wechat_user";
import WechatService from "../wechat/services/wechat";



// WeChat 模块
declare namespace WeChat {
  interface Controller {
    index: IndexController;
    login: LoginController;
  }

  interface Config {
    wechat: WechatConfig
  }

  interface Service {
    wechat: WechatService;
    wechatUser: WechatUserService
  }

  interface Middleware {
  }

  interface Repository {
    wechatUser: WeChatUserRepository
  }

  interface ValidateRule {
  }
}