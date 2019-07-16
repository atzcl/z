/* eslint-disable @typescript-eslint/no-use-before-define */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建 Model
*/

import * as yargs from 'yargs';
import * as fs from 'fs-extra';
import { getCommandConfig } from '@my_console/utils/config';
import { snakeCase } from 'lodash';
import {
  notEmpty, resolve, abort, makeFileSuccess, templateCompile, studlyCase, upperFirst, camelCase,
  plural,
} from '@my_console/utils';


const MAKE_TYPE = 'model';
const MAKE_TYPE_DIR = 'models';
const MAKE_TYPE_NAME = '模型';
const MAKE_TYPE_EXTNAME = 'ts';

export default class CreateModelCommand implements yargs.CommandModule {
  command = `make:${MAKE_TYPE}`;

  // 定义的命令
  describe = `生成${MAKE_TYPE_NAME}`;

  // 说明
  aliases = 'm'; // 别名

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

    // 验证不为空
    notEmpty({ name, module });

    // 获取全局配置
    const config = getCommandConfig();
    // 当前模块的路径
    const currentModulePath = resolve(config.modulePath, module);
    const currentFilePath = resolve(currentModulePath, `${MAKE_TYPE_DIR}/${name}.${MAKE_TYPE_EXTNAME}`);

    if (! fs.existsSync(currentModulePath)) {
      abort('当前模块不存在，请先创建对应模块');
    }

    if (fs.pathExistsSync(currentFilePath)) {
      abort(`当前${MAKE_TYPE_NAME}名称已存在，请换一个名称`);
    }

    // 确保目录存在
    fs.ensureDirSync(resolve(currentModulePath, MAKE_TYPE_DIR));

    createHandler(module, name, currentFilePath, config.templateRootPath);
  }
}

/**
 * 生成处理器
 *
 * @param {string} moduleName 需要创建所在的模块名称
 * @param {string} fileName 生成的文件名称
 * @param {string} filePath 生成的文件路径
 * @param {string} templateRootPath // 生成文件对应的模板路径
 */
export const createHandler = (moduleName: string, fileName: string, filePath: string, templateRootPath: string) => {
  // 转换为大驼峰
  // todo: 因为当前框架尚没有对重命名的类进行相关处理，所以这里加上模块名称来尽可能地避免
  const studlyCaseName = studlyCase(`${moduleName}-${fileName}`);
  // 可能存在的目录分割
  const fileNameArray = fileName.split('/');
  // 将最后的字符转化为复数并转为下划线格式
  fileNameArray[fileNameArray.length - 1] = snakeCase(plural(fileNameArray[fileNameArray.length - 1]));
  // 转化为复数
  const pluralName = fileNameArray.join('/');
  // 完整的名称
  const fullStudlyCaseName = `${studlyCaseName}${upperFirst(MAKE_TYPE)}`;

  // 获取生成的模板文件内容
  const templateString = fs.readFileSync(resolve(templateRootPath, MAKE_TYPE)).toString();
  // 生成真实文件
  fs.outputFile(
    filePath,
    templateCompile(
      templateString,
      { name: studlyCaseName, pluralName, camelCaseName: camelCase(fullStudlyCaseName) },
    ),
  )
    .then(() => makeFileSuccess(fullStudlyCaseName))
    .catch(() => abort('创建文件失败'));
};
