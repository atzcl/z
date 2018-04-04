import Auth from "../admin/validates/auth";
import UserAdminController from "../admin/controllers/user_admin";
import AuthService from "../admin/services/auth";
import UserAdminRepository from "../admin/repositories/user_admin";


// Admin 模块
declare namespace Admin {
  interface Controller {
    userAdmin: UserAdminController
  }

  interface Config {}

  interface Service {
    auth: AuthService
  }

  interface Repository {
    userAdmin: UserAdminRepository
  }

  interface Middleware {
  }

  interface ValidateRule {
    auth: Auth
  }
}