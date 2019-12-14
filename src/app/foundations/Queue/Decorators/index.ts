/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 集中导出封装的自定义装饰器
|
*/

import { JobsContainer } from '../Container'


export const provide = (identifier?: string) => (target: any) => {
  if (! identifier) {
    // identifier = camelCase(target.name);

    // eslint-disable-next-line no-param-reassign
    identifier = target.name as string
  }

  JobsContainer.bind(identifier, target)

  return target
}
