/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 价格相关的单位都是 分，所以这里做一下统一的处理
|
*/

import { DataType } from 'sequelize-typescript';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';

import { MathCalcul } from '../../Support/Math';

/**
 * @see https://github.com/RobinBuschmann/sequelize-typescript/blob/master/lib/annotations/Column.ts
 */
export function PriceColumn(target: any, propertyName: string): void {
  addAttribute(
    target,
    propertyName,
    {
      type: DataType.BIGINT,
      get() {
        const current = this.getDataValue(propertyName);

        return current ? new MathCalcul(current).modulo(100).toNumber() : current
      },
      set(value: number) {
        this.setDataValue(propertyName, new MathCalcul(value).multipliedBy(100).toNumber());
      },
      defaultValue: 0,
    },
  );
}
