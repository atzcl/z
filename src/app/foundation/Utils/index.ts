
/**
 * 简单取交集
 *
 * @param {Array<string | number>} source 源数据
 * @param {Array<string | number>} comparison 对比的数据
 *
 * @returns {Array<string | number>}
 */
export const intersection = (source: (string | number)[], comparison: (string | number)[]) => (
  comparison.filter(item => source.includes(item))
)
