import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

import UuidPrimary from './UuidPrimary';
import Timestamps from './Timestamps';
import SoftDeletes from './SoftDeletes';


export type TRegularField = 'id' | 'created_at'
| 'updated_at' | 'deleted_at' | 'user_application_platform_id'

type Result = TableColumnOptions[] | any

// 定义 column
export const definitionColumns = (more: TableColumnOptions[] = [], only: TRegularField[] = []): Result => {
  return [
    ...[...UuidPrimary].filter((item: any) => ! only.includes(item.name)),

    ...more,

    ...[
      {
        name: 'user_application_platform_id',
        type: 'char',
        length: '32',
        isNullable: false,
        comment: '当前所属应用所属平台 id',
      },

      ...Timestamps,
      ...SoftDeletes,
    ].filter((item: any) => ! only.includes(item.name)),
  ]
}
