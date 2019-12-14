/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 添加 Scopes 设置
|
*/

import { WhereOptions, Includeable } from 'sequelize/types';
import { addScopeOptionsGetter } from 'sequelize-typescript';
import { isObj } from '@app/foundations/Utils';

import { AddUserApplicationPlatformScope } from './ApplicationPlatformIdScope';



const generalScopes = {
  userApplicationPlatformScope: AddUserApplicationPlatformScope,
}

type GeneralScopesKeys = (keyof typeof generalScopes)[];

interface ScopesObject {
  [k: string]: {
    where?: WhereOptions,
    include?: Includeable[],
  } | Function;
}

// type ScopesFunction = (...args: any[]) => ({
//   where?: WhereOptions,
//   include?: Includeable,
// })

type ScopesFullType = ScopesObject;

export const Scopes = (scopes: ScopesFullType | GeneralScopesKeys, more: ScopesFullType = {}) => (target: any) => {
  let realScopes = (isObj(scopes) && scopes) || {} as any;

  if (Array.isArray(scopes)) {
    scopes.forEach((scope) => {
      if (generalScopes[scope]) {
        realScopes = {
          ...realScopes,
          ...generalScopes[scope],
        }
      }
    })
  }

  addScopeOptionsGetter(target.prototype, {
    getScopes: () => ({
      ...realScopes,
      ...more,
    }),
  });
}
