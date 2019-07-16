/* eslint-disable @typescript-eslint/no-var-requires */

/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 注册传递 tsconfig paths 参数
|
*/

const tsConfigPaths = require('tsconfig-paths');

const tsConfig = require('./tsconfig.json');


const { outDir, baseUrl, paths } = tsConfig.compilerOptions;

// 替换 src 目录为编译目录
const keys = Object.keys(paths);
for (let i = 0; i < keys.length; i++) {
  const name = keys[i];
  paths[name][0] = paths[name][0].replace(/src/g, outDir);
}

tsConfigPaths.register({ baseUrl, paths });
