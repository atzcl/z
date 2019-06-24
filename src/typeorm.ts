/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建 typeorm 实例
|
*/

import { provide, scope, ScopeEnum, init } from 'midway';
import { createConnection, Connection, getConnectionOptions } from 'typeorm';
import SnakeNamingStrategy from '@/lib/Other/SnakeNamingStrategy';

/**
 * 创建 typeorm 链接
 *
 * @see http://typeorm.io/#/connection-options
 */
@scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@provide('typeormSingleton')
export default class TypeOrm {
  public typeOrmConnection: Connection;

  @init()
  async connect() {
    this.typeOrmConnection = await getConnectionOptions()
    .then((connectionOptions) => {
        return createConnection({
          ...connectionOptions,
          namingStrategy: new SnakeNamingStrategy(),
        });
    });

    // // app.typeorm
    // Object.defineProperty(app, 'typeorm', {
    //   value: connection,
    //   writable: false,
    //   configurable: false,
    // });
  }
}
