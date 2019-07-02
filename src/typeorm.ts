/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建 typeorm 实例
|
*/

import { provide, scope, ScopeEnum, init, plugin, EggLogger } from 'midway';
import { createConnection, Connection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from '@/lib/Other/SnakeNamingStrategy';
import { TypeORMLogger } from '@/lib/Other/TypeORMLogger';

/**
 * 创建 typeorm 链接
 *
 * @see http://typeorm.io/#/connection-options
 */
@scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@provide('typeormSingleton')
export default class TypeORM {
  @plugin('logger')
  logger: EggLogger;

  // typeorm 链接实例
  typeORMConnection: Connection;

  @init()
  async connect() {
    this.typeORMConnection = await getConnectionOptions()
      .then((connectionOptions) => {
        return createConnection({
          ...connectionOptions,
          logger: new TypeORMLogger(this.logger), // 自定义日志
          namingStrategy: new SnakeNamingStrategy(),
        });
      });
  }
}
