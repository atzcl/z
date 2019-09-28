/* eslint-disable @typescript-eslint/no-use-before-define */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 执行 typeorm 的数据库迁移
*/

import * as process from 'child_process';

import * as yargs from 'yargs';


const MAKE_TYPE = 'migration:run';
const MAKE_TYPE_NAME = '数据库迁移';

export default class CreateMigrationRunCommand implements yargs.CommandModule {
  command = `make:${MAKE_TYPE}`;

  // 定义的命令
  describe = `执行${MAKE_TYPE_NAME}`;

  // 说明
  aliases = 'mi-run'; // 别名

  // 给当前命令添加额外的设置
  builder(args: yargs.Argv) {
    return args;
  }

  /**
   * 执行业务处理
   *
   * @param args
   */
  async handler() {
    process.exec('yarn typeorm migration:run', (err, stdout) => {
      // 打印执行结果
      if (err) {
        console.error(err);

        return;
      }

      console.log(stdout)
    })
  }
}
