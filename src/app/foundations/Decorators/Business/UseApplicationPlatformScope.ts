/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 快捷添加 applicationPlatform 查询作用域条件到当前被装饰的方法所属的类所注入的 Service 类中的查询构造器中去
|
*/

import { makeMethodDecoratorForControllerAndInjectService } from '../Utils';


export const UseApplicationPlatformScope = makeMethodDecoratorForControllerAndInjectService(async (controler) => {
  // 这两个都是同步代码
  controler.service.addApplicationPlatformScope(
    controler.getJwtUserClaims('application_platform_id'),
  );
})
