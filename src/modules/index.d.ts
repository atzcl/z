// import UserController from "./user/controllers/user";
// import UserService from "./user/services/user";
// import UserValidate from "./user/validates/user";
// import IndexController from "./wechat/controllers";
// import LoginController from "./wechat/controllers/login";
// import { WechatConfig } from "./wechat/config/app";
// import LoginService from "./wechat/services/login";

// declare module 'egg' {
//   // 拓展 egg 的 app 对象
//   export interface Application {
//     modules: {
//       controller: {
//         user: {
//           user: UserController
//         },
//         wechat: {
//           index: IndexController;
//           login: LoginController
//         }
//       },
//       middleware: {
//         user: {
//           test(app: Application): Function
//         }
//         wechat: {
//           test(app: Application): Function
//         }
//       };
//     },
//   }

//   export interface Context {
//     adminService: Admin.Service;
//     adminRepository: Admin.Repository;
//     adminValidateRule: Admin.ValidateRule;
  
//     userService: User.Service;
//     userRepository: User.Repository;
//     userValidateRule: User.ValidateRule;

//     wechatService: WeChat.Service;
//     wechatRepository: WeChat.Repository;
//     wechatValidateRule: WeChat.ValidateRule;
//   }
// }

// // admin 模块
// declare namespace Admin {
//   interface Config {
//     wechat: WechatConfig;
//   }

//   interface Service {
//     user: UserService;
//     wechat: {
//       login: LoginService
//     }
//   }

//   interface Repository {
//     user: UserService
//   }

//   interface ValidateRule {
//     user: UserValidate
//   }
// }

// // user 模块
// declare namespace User {
//   interface Config {
//     wechat: WechatConfig;
//   }

//   interface Service {
//     user: UserService;
//   }

//   interface Repository {
//     user: UserService
//   }

//   interface ValidateRule {
//     user: UserValidate
//   }
// }

// // wechat 模块
// declare namespace WeChat {
//   interface Config {
//     wechat: WechatConfig;
//   }

//   interface Service {
//     login: LoginService
//   }

//   interface Repository {
//     user: UserService
//   }

//   interface ValidateRule {
//     user: UserValidate
//   }
// }