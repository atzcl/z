/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| User 模块路由
|
*/

import { Application } from 'egg';

module.exports = (app: Application) => {
  const { router } = app;
  const { user } = app.modules.controller;

  // 定义路由前缀并设置使用的中间件
  const userRouter = router.namespace('/v1/user/');

  // 登录
  userRouter.post('user.login', 'login', user.user.login);
  // 注册
  userRouter.post('user.register', 'register', user.user.register);
  // 重置密码
  userRouter.post('user.password_reset', 'password/reset', user.user.updatePassword);
  // 验证密码的正确性
  userRouter.post('user.verify_password_reset', 'password/verify', user.user.resetPassword);
  // 发送密码重置邮件
  userRouter.post('user.password_email', 'password/email', user.user.sendPasswordResetEmail);
};
