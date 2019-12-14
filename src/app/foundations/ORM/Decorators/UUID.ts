/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 sequelize-typescript column 装饰器, uuid 主键
|
*/

import { DataType } from 'sequelize-typescript';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';

import { smallUUID } from '../../Utils';


export const uuidPrimaryKeyOptions = (column: string) => ({
  type: DataType.STRING,
  unique: true,
  primaryKey: true,
  set() {
    (this as any).setDataValue(column, smallUUID())
  },
  defaultValue: smallUUID,
});

/**
 * @see https://github.com/RobinBuschmann/sequelize-typescript/blob/master/lib/annotations/Column.ts
 */
export function UUID(target: any, propertyName: string): void {
  const options = uuidPrimaryKeyOptions(propertyName);

  addAttribute(target, propertyName, options);
}
