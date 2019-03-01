/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证 body 的方法装饰器
|
*/

import * as MetadataClass from 'injection/dist/utils/Metadata';

export function query() {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    console.log((new MetadataClass.Metadata('inject', 'ctx')));
    // target[propertyName] = 111;

    // Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
  };
}
