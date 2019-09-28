/* eslint-disable @typescript-eslint/no-use-before-define */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建 Service
*/

import * as process from 'child_process';

import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import * as dayjs from 'dayjs';
import { getCommandConfig } from '@my_console/utils/config';
import {
  notEmpty, resolve, abort, makeFileSuccess, templateCompile, studlyCase,
  plural,
} from '@my_console/utils';


const MAKE_TYPE = 'migration';
const MAKE_TYPE_DIR = 'Migrations';
const MAKE_TYPE_NAME = '数据库迁移';
const MAKE_TYPE_EXTNAME = 'ts';

export default class CreateMigrationCommand implements yargs.CommandModule {
  command = `make:${MAKE_TYPE}`;

  // 定义的命令
  describe = `生成${MAKE_TYPE_NAME}`;

  // 说明
  aliases = 'mi'; // 别名

  // 给当前命令添加额外的设置
  builder(args: yargs.Argv) {
    return args
      .option('name', {
        alias: 'n',
        describe: `${MAKE_TYPE_NAME}名称`,
      })
      .option('module', {
        alias: 'm',
        describe: '所在的模块',
      })
      .option('create_model', {
        alias: 'c',
        describe: '创建对应模型',
      });
  }

  /**
   * 执行业务处理
   *
   * @param args
   */
  async handler(args: yargs.Arguments) {
    const name = `${args.name || args._[1]}`;
    const module = `${args.module || args._[2]}`;
    const isCreateModel = Boolean(args.create_model || args._[3]);

    // 验证不为空
    notEmpty({ name, module });

    // 获取全局配置
    const config = getCommandConfig();
    // 当前模块的路径
    const currentModulePath = resolve(config.modulePath, module);

    if (! fs.existsSync(currentModulePath)) {
      abort('当前模块不存在，请先创建对应模块');
    }

    // 毫秒时间戳
    const millisecondUnix = dayjs().valueOf();
    const fileName = `${millisecondUnix}-${name}`;
    const currentFilePath = resolve(currentModulePath, `${MAKE_TYPE_DIR}/${fileName}.${MAKE_TYPE_EXTNAME}`);

    // 完全模拟 typeorm 的格式
    if (fs.pathExistsSync(fileName)) {
      abort(`当前${MAKE_TYPE_NAME}名称已存在，请换一个名称`);
    }

    // 确保目录存在
    fs.ensureDirSync(resolve(currentModulePath, MAKE_TYPE_DIR));

    createControllerHandler(module, fileName, currentFilePath, config.templateRootPath, isCreateModel);
  }
}

/**
 * 生成处理器
 *
 * @param {string} moduleName 需要创建所在的模块名称
 * @param {string} fileName 生成的文件名称
 * @param {string} filePath 生成的文件路径
 * @param {string} templateRootPath // 生成文件对应的模板路径
 * @param {boolean} isCreateModel 是否创建对应 model
 */
export const createControllerHandler = (
  moduleName: string,
  fileName: string,
  filePath: string,
  templateRootPath: string,
  isCreateModel?: boolean,
// eslint-disable-next-line max-params
) => {
  const realName = fileName.split('-')[1].replace(/create_|_table|_data/ug, '');

  // 转化为复数
  const pluralName = plural(realName);

  // 获取生成的模板文件内容
  const templateString = fs.readFileSync(resolve(templateRootPath, MAKE_TYPE)).toString();

  // 生成真实文件
  fs.outputFile(
    filePath,
    templateCompile(
      templateString,
      {
        studlyCaseName: studlyCase(realName),
        tableName: pluralName,
        pluralName,
        fileName: `${studlyCase(realName)}${dayjs().valueOf()}`,
      },
    ),
  )
    .then(() => {
      makeFileSuccess(fileName);

      if (isCreateModel) {
        process.exec(`yarn z m ${realName} ${moduleName}`, (err, stdout) => {
          // 打印执行结果
          console.log(stdout)
        })
      }
    })
    .catch(() => abort('创建文件失败'));
};
