// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import ExtendObject from '../../../app/extend/application';
declare module 'egg' {
  interface Application {
    modules: typeof ExtendObject.modules;
    createBcrypt: typeof ExtendObject.createBcrypt;
    verifyBcrypt: typeof ExtendObject.verifyBcrypt;
  }
}