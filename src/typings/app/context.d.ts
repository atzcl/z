import ExtendObject from '@app/extend/context';

declare module 'egg' {
  interface Context {
    abort: typeof ExtendObject.abort;
    validate: typeof ExtendObject.validate;
  }
}
