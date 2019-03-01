/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义名称转换
|
*/

import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export default class SnakeNamingStrategy extends DefaultNamingStrategy {
  columnName(propertyName, customName, embeddedPrefixes) {
    return customName ? customName : snakeCase(propertyName);
  }
}
