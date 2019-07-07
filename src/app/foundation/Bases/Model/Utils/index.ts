interface IOptions {
  isUseHidden: boolean;
  tempHidden?: string[];
  hidden: string[];
  isUseVisible: boolean;
  tempVisible?: string[];
  visible: string[];
}

// 判断是否为空
export const isEmpty = (value: any) => value === null || value === undefined;

/**
 * 包装查询结果
 *
 * @param mixed $result
 *
 * @return mixed
 */
export const parserResult = (modelResult: any, options: IOptions) => {
  /**
   * @desc 当结果是数组的时候，那么默认是更新操作后的结果, 而更新的成功返回都是影响条数的数组
   */
  if (! modelResult || typeof modelResult !== 'object' || Array.isArray(modelResult)) {
    return modelResult;
  }

  // 获取查询值
  let dataValues = modelResult.dataValues || modelResult;

  // 处理 visible
  if (options.isUseVisible) {
    dataValues = makeHiddenColumn(dataValues, options.tempVisible || options.visible);
  }

  // 处理 hidden
  if (options.isUseHidden) {
    dataValues = makeVisibleColumn(dataValues, options.tempHidden || options.hidden);
  }

  // 重新赋值
  modelResult.dataValues = dataValues;

  return modelResult;
};

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

  // 当前先处理一层吧，后面有需求再拓展
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (dataValues.hasOwnProperty(column)) {
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

  // 当前先处理一层吧，后面有需求再拓展
  const keys = Object.keys(dataValues);
  for (let i = 0; i < keys.length; i++) {
    // 因为当前都是使用了 static，所以就不开启新的值来储存配对结果了，直接对传入的查询结果取反值就好了
    if (! columns.includes(keys[i])) {
      delete (dataValues as any)[keys[i]];
    }
  }

  return dataValues;
};
