/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 sequelize-typescript column 装饰器, 默认定义的 column 集合
|
*/

import { DataType } from 'sequelize-typescript';
import { addAttribute } from 'sequelize-typescript/dist/model/column/attribute-service';

import { BaseModel } from '../../Bases/Model/BaseModel';


import { uuidPrimaryKeyOptions } from './UUID';
import { FormatTimestampOptions } from './FormatTimestamp';


export interface IDefaultColumns {
  id: string;
  user_application_platform_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

const columnOptions = {
  id: uuidPrimaryKeyOptions('id'),

  user_application_platform_id: {
    type: DataType.STRING,
    allowNull: false,
    comment: '当前应用所属人的 id',
  },

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

  Object.keys(columnOptions)
    .filter(column => ! except.includes(column as TColumnOptionKeys))
    .forEach((column) => {
      addAttribute(target, column, columnOptions[column as TColumnOptionKeys]);
    })
}
