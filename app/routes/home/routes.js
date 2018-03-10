"use strict";
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| Home 模块路由
|
*/
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    const { controller, router } = app;
    router.get('/test', controller.home.index.index);
};
