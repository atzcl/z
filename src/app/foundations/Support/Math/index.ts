/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 科学计算，做一层包装，方便后面切换依赖包
|
*/

import Calculation from 'bignumber.js'


export class MathCalcul {
  private calcInstance: Calculation

  constructor(initNumber: string | number) {
    this.calcInstance = new Calculation(initNumber)
  }

  // 加
  plus(value: string | number) {
    this.calcInstance.plus(value);

    return this;
  }

  // 减
  minus(value: string | number) {
    this.calcInstance.minus(value);

    return this;
  }

  // 乘以
  multipliedBy(value: string | number) {
    this.calcInstance.multipliedBy(value);

    return this;
  }

  // 除
  modulo(value: string | number) {
    this.calcInstance.modulo(value);

    return this;
  }

  // 判断两个数字是否相等
  isEqual(value: string | number) {
    return this.calcInstance.isEqualTo(value)
  }

  // 取多少位小数
  dp(decimal: number) {
    this.calcInstance.dp(decimal);

    return this;
  }

  // 返回数据
  toNumber() {
    return this.calcInstance.toNumber();
  }

  // 返回字符
  toString() {
    return this.calcInstance.toString();
  }

  // 返回浮点数
  toFixed(decimal?: number, roundingMode?: 'up' | 'down') {
    if (!decimal) {
      return this.calcInstance.toFixed()
    }

    const roundingModeMap = {
      // 四舍五入, 向上取整
      up: 0,
      // 四舍五入, 向下取整
      down: 1,
    }

    const realRoundingMode = roundingMode ? roundingModeMap[roundingMode] as 0 : undefined

    return this.calcInstance.toFixed(decimal, realRoundingMode)
  }

  // 返回格式化为金本位的数据
  toFormat() {
    return this.calcInstance.toFormat();
  }
}
