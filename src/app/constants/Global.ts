/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 全局使用的常量
|
*/

/**
 * 多语言类型常量
 */
export enum LANG_TYPE_MAP {
  CN = 1,
  EN = 2,
}

/**
 * 应用类型类型常量
 */
export enum APPLICATION_TYPE_MAP {
  WEB = 1,
  MINIPROGRAM = 2,
  APP = 3,
}

/**
 * 字段名称
 */
export enum Field_Names {
  // 当前用户绑定的应用平台表 id
  APPLICATION_PLATFORM_ID = 'user_application_platform_id'
}

/**
 * redis key
 */
export enum CACHE_KEYS {
  CONFIG_OFFICIAL_ACCOUNT = 'official_account:config:'
}

/**
 * 默认状态
 */
export enum DEFAULT_STATUS {
  // 禁用
  DISABLE = 0,
  // 正常
  NORMAL = 1,
  // 禁用
  INVALID = 2,
}

/**
 * 资源类型
 */
export enum RESOURCE_TYPES {
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  FILE = 4,
  ICON_MATERIAL = 5,
  IMAGE_MATERIAL = 6,
  ALL = 9
}
