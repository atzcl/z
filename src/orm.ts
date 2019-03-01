import { provide, scope, ScopeEnum, init, config } from 'midway';
import { Sequelize } from 'sequelize-typescript';
import { camelCase, upperFirst } from 'lodash';

@scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@provide('sequelizeSingleton')
export class ORM {
  @config('sequelize')
  options;

  @config('baseDir')
  baseDir;

  public sequelizeConnection: Sequelize;

  @init()
  connect() {
    this.sequelizeConnection = new Sequelize({
      ...this.options,
      ...{
        // 模型存放的目录
        modelPaths: [ `${this.baseDir}/app/modules/**/models/*{.ts,.js}` ],
        modelMatch: (filename, member) => {
          // 匹配模型的格式, 转换为大驼峰写法再比较
          return upperFirst(camelCase(`${filename}_model`)) === member;
        },
      },
    });
  }
}
