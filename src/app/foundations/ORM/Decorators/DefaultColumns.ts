/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 sequelize-typescript column 装饰器, 默认定义的 column 集合
|
*/

import { addOptions } from 'sequelize-typescript/dist/model/shared/model-service';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';

import { BaseModel } from '../Model/BaseModel';


import { uuidPrimaryKeyOptions } from './UUID';
import { FormatTimestampOptions } from './FormatTimestamp';


export interface IDefaultColumns {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

// https://github.com/RobinBuschmann/sequelize-typescript/blob/master/src/model/column/timestamps/deleted-at.ts
const columnOptions = {
  id: uuidPrimaryKeyOptions('id'),

  created_at: FormatTimestampOptions('created_at'),
  updated_at: FormatTimestampOptions('updated_at'),
  deleted_at: FormatTimestampOptions('deleted_at'),
}

type TColumnOptionKeys = keyof typeof columnOptions

interface IOptions {
  except: TColumnOptionKeys[];
}


/**
 * @see https://github.com/RobinBuschmann/sequelize-typescript/blob/master/lib/annotations/Column.ts
 */

export function DefaultColumns(options: IOptions): Function;
export function DefaultColumns(target: Function): void;
export function DefaultColumns(arg: any): void | Function {
  if (typeof arg === 'function') {
    annotate((arg as Function).prototype);
  } else {
    const options: IOptions = { ...arg };
    return (target: any) => annotate(target, options);
  }
}

function annotate(target: typeof BaseModel, options: IOptions = {} as IOptions): void {
  const { except = [] } = options || {};

  // 增加时间戳、开启软删除设置
  addOptions(target, { timestamps: true, paranoid: true });

  Object.keys(columnOptions)
    .filter(column => ! except.includes(column as TColumnOptionKeys))
    .forEach((column) => {
      addAttribute(target, column, columnOptions[column as TColumnOptionKeys]);
    })
}
