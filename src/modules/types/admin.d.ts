import LoginController from "../admin/controllers/auth/login";
import RegisterController from "../admin/controllers/auth/register";
import LoginRepository from "../admin/repositories/auth/login";
import RegisterRepository from "../admin/repositories/auth/register";
import Auth from "../admin/validates/auth";


// Admin 模块
declare namespace Admin {
  interface Controller {
    login: LoginController;
    register: RegisterController;
  }

  interface Config {}

  interface Service {
  }

  interface Repository {
    login: LoginRepository;
    register: RegisterRepository;
  }

  interface Middleware {
  }

  interface ValidateRule {
    auth: Auth
  }
}