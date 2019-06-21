const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const { outDir, baseUrl, paths } = tsConfig.compilerOptions;

// 替换 src 目录为编译目录
const keys = Object.keys(paths);
for (let i = 0; i < keys.length; i++) {
  const name = keys[i];
  paths[name][0] = paths[name][0].replace(/src/g, outDir);
}

tsConfigPaths.register({ baseUrl, paths });
