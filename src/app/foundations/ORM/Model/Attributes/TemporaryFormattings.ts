/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 链式设置格式属性的默认数据
|
*/

export interface ITemporaryFormattings {
  isUseHidden: boolean;
  tempHidden: string[];
  isUseVisible: boolean;
  tempVisible: string[];
}

export const temporaryFormattingsDefault = {
  // 是否使用隐藏
  isUseHidden: false,
  // 临时值，优先级比 hidden 高
  tempHidden: [],
  // 是否使用输出显示的白名单
  isUseVisible: false,
  // 临时值，优先级比 visible 高
  tempVisible: [],
}
