/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  Blog：https://www.atzcl.cn
+-----------------------------------------------------------------------------------------------------------------------
| User 模块路由
|
*/

import { Application } from 'egg';

module.exports = (app: Application) => {
  const { router } = app;
  const { user } = app.modules.controller;

  // 定义路由前缀并设置使用的中间件
  const userRouter = router.namespace('/v1/users/');

  const userController = user.user;

  // 注册
  userRouter.post('user.register', '', userController.register);
  // 登录
  userRouter.post('user.login', 'login', userController.login);
  // 重置密码
  userRouter.post('user.password_reset', 'password/reset', userController.updatePassword);
  // 验证密码的正确性
  userRouter.post('user.verify_password_reset', 'password/verify', userController.resetPassword);
  // 发送密码重置邮件
  userRouter.post('user.password_email', 'password/email', userController.sendPasswordResetEmail);
};
