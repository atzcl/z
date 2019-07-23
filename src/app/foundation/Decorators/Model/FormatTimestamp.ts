/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 sequelize-typescript column 装饰器, 格式化时间
|
*/

import * as dayjs from 'dayjs';
import { getSequelizeTypeByDesignType } from 'sequelize-typescript/dist/model/shared/model-service';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';

/**
 * @see https://github.com/RobinBuschmann/sequelize-typescript/blob/master/lib/annotations/Column.ts
 */
export function FormatTimestamp(target: any, propertyName: string): void {
  const options = {
    type: getSequelizeTypeByDesignType(target, propertyName),
    get() {
      const time = (this as any).getDataValue(propertyName);

      // todo: 到时候可以把时间的格式设置到 model 表上
      return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : null;
    },
  };

  addAttribute(target, propertyName, options);
}