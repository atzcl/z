/* eslint-disable max-len */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 常用验证
|
*/

export const idCard = (value: any) => (
  /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/u.test(value)
)

// https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
export const phone = (value: any) => (
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/u.test(value)
)

// 验证字段必须完全由字母构成。
export const alpha = (value: any) => /^[a-zA-Z]+$/u.test(value)

// 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
export const alphaDash = (value: any) => /^[a-zA-Z0-9_-]$/u.test(value)

// 验证字段必须是完全是字母、数字。
export const alphaNum = (value: any) => /^[A-Za-z0-9]+$/u.test(value)

// 微信号，6至20位，以字母开头，字母，数字，减号，下划线
export const weChatNumber = (value: any) => /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/u.test(value)
