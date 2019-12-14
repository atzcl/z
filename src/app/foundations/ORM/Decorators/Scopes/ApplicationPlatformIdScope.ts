/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 添加 user_application_platform_id 字段的查询作用域
|
*/

// import { addScopeOptions } from 'sequelize-typescript';

import { operatorTypes } from '../../Model/Attributes/OperatorTypes';


export const UserApplicationPlatformScopes = {
  where: 'userApplicationPlatform',
  orWhere: 'userApplicationPlatformOr',
}

export const AddUserApplicationPlatformScope = {
  // user_application_platform_id 的 where 条件
  [UserApplicationPlatformScopes.where](id: string) {
    return {
      where: {
        user_application_platform_id: id,
      },
    }
  },

  // user_application_platform_id 的 orWhere 条件
  [UserApplicationPlatformScopes.orWhere](id: string) {
    return {
      where: {
        user_application_platform_id: {
          [operatorTypes.or]: id,
        },
      },
    }
  },
}

// export const AddUserApplicationPlatformScope = (target: any) => {
//   addScopeOptions(target.prototype, {
//     getScopes: () => ({
//       // user_application_platform_id 的 where 条件
//       [UserApplicationPlatformScopes.where](id: string) {
//         return {
//           where: {
//             user_application_platform_id: id,
//           },
//         }
//       },

//       // user_application_platform_id 的 orWhere 条件
//       [UserApplicationPlatformScopes.orWhere](id: string) {
//         return {
//           where: {
//             user_application_platform_id: {
//               [operatorTypes.or]: id,
//             },
//           },
//         }
//       },
//     }),
//   });
// }
