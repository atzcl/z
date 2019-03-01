import ExtendObject from '@app/extend/helper';

declare module 'egg' {
  interface IHelper {
    toResponse: typeof ExtendObject.toResponse;
    generateMD5: typeof ExtendObject.generateMD5;
    generateUniqId: typeof ExtendObject.generateUniqId;
    cache: typeof ExtendObject.cache;
    jwt: typeof ExtendObject.jwt;
    strRandom: typeof ExtendObject.strRandom;
    createBcrypt: typeof ExtendObject.createBcrypt;
    verifyBcrypt: typeof ExtendObject.verifyBcrypt;
    checkUploadFileExt: typeof ExtendObject.checkUploadFileExt;
  }
}
