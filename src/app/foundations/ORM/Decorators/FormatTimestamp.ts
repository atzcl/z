/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 sequelize-typescript column 装饰器, 格式化时间
|
*/

import * as dayjs from 'dayjs';
import { DataType } from 'sequelize-typescript';
// import { getSequelizeTypeByDesignType } from 'sequelize-typescript/dist/model/shared/model-service';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';


export const FormatTimestampOptions = (propertyName: string) => ({
  type: DataType.DATE,
  get() {
    const time = (this as any).getDataValue(propertyName);

    return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : null;
  },
})

/**
 * @see https://github.com/RobinBuschmann/sequelize-typescript/blob/master/lib/annotations/Column.ts
 */
export function FormatTimestamp(target: any, propertyName: string): void {
  const options = FormatTimestampOptions(propertyName);

  addAttribute(target, propertyName, options);
}
