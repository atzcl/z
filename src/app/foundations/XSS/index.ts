/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| xss 过滤
|
*/

import { FilterXSS, whiteList as XSSWhiteList } from 'xss';


export const filterXSSInHtml = (html = '') => {
  const xss = new FilterXSS({
    whiteList: {
      ...XSSWhiteList,
      figure: ['class'],
    } as any,
  })

  return xss.process(html)
}
