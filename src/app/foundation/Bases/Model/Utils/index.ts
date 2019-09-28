interface ParserOptions {
  tempHidden: string[];
  hidden: string[];
  tempVisible: string[];
  visible: string[];
}

// 判断是否为空
export const isEmpty = (value: any) => value === null || value === undefined;

export const hasOwnProperty = (obj: object, property: string) => (
  Object.prototype.hasOwnProperty.call(obj, property)
);

/**
 * 传入查询结果，过滤指定字段值
 *
 * @param {object} dataValues 查询结果值
 * @param {string[]} columns 需要去除的字段集合
 *
 * @returns {object}
 */
export const makeHiddenColumn = (dataValues: object, columns: string[] = []) => {
  // 原样返回
  if (! columns.length || ! Object.keys(dataValues).length) {
    return dataValues;
  }

  // 当前先处理一层吧，后面有需求再递归
  for (const column of columns) {
    if (Object.prototype.hasOwnProperty.call(dataValues, 'column')) {
      delete (dataValues as any)[column];
    }
  }

  return dataValues;
};

/**
 * 传入查询结果，提取指定字段值 (跟 makeHiddenColumn 相反)
 *
 * @param {object} dataValues 查询结果值
 * @param {string[]} columns 需要提取的字段集合
 *
 * @returns {object}
 */
export const makeVisibleColumn = (dataValues: object, columns: string[] = []) => {
  // 原样返回
  if (! columns.length || ! Object.keys(dataValues).length) {
    return dataValues;
  }

  // 当前先处理一层吧，后面有需求再递归
  const keys = Object.keys(dataValues);
  for (const columnName of keys) {
    // 因为当前都是使用了 static，所以就不开启新的值来储存配对结果了，直接对传入的查询结果取反值就好了
    if (! columns.includes(columnName)) {
      delete (dataValues as any)[columnName];
    }
  }

  return dataValues;
};

/**
 * 包装查询结果
 *
 * @param mixed $result
 *
 * @return mixed
 */
export const parserResult = (modelResult: any, options: ParserOptions) => {
  /**
   * @desc 当结果是数组的时候，那么默认是更新操作后的结果, 而更新的成功返回都是影响条数的数组
   */
  if (! modelResult
    || typeof modelResult !== 'object'
    || Array.isArray(modelResult)
    || ! Object.keys(options).length
  ) {
    return modelResult;
  }

  // 获取查询值
  let dataValues = modelResult.dataValues || modelResult;

  // 处理 visible
  if (options.tempVisible.length || options.visible.length) {
    dataValues = makeHiddenColumn(dataValues, options.tempVisible || options.visible);
  }

  // 处理 hidden
  if (options.tempHidden.length || options.hidden.length) {
    dataValues = makeVisibleColumn(dataValues, options.tempHidden || options.hidden);
  }

  // 重新赋值
  modelResult.dataValues = dataValues;

  return modelResult;
};
