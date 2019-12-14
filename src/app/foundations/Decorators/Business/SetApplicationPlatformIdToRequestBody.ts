/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 将 user_application_platform_id 设置到 request body 数据中
|
*/

import { makeMethodDecoratorForController } from '../Utils';


export const SetApplicationPlatformIdToRequestBody = makeMethodDecoratorForController(async (controller) => {
  // 同步代码
  controller.request.offsetSet('user_application_platform_id', controller.getJwtUserClaims('application_platform_id'));
})
