/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 封装一些常用的获取 http 参数的装饰器
|
*/

// eslint-disable-next-line import/no-extraneous-dependencies
import { attachPropertyDataToClass } from 'injection';
import { WEB_ROUTER_PARAM_KEY, Context } from 'midway';

// import { Controller } from '../Bases/BaseController';

/**
 * @see https://github.com/nestjs/nest/blob/master/packages/common/decorators/http/route-params.decorator.ts
 */

/**
* 为了保持跟常规的 Controller 里面的使用一样，这里取值是从封装的 Base Request 里面拿的，也可以参考 midway 的做法
*
* @see https://github.com/midwayjs/midway/blob/master/packages/midway-decorator/src/web/paramMapping.ts
*/

type PropertyParamData = string | string[];

export type ParamData = object | PropertyParamData;

interface GetFileStreamOptions {
  requireFile?: boolean; // required file submit, default is true
  defCharset?: string;
  limits?: {
    fieldNameSize?: number,
    fieldSize?: number,
    fields?: number,
    fileSize?: number,
    files?: number,
    parts?: number,
    headerPairs?: number,
  };
  checkFile?(
    fieldname: string,
    file: any,
    filename: string,
    encoding: string,
    mimetype: string
  ): void | Error;
}

interface GetFilesStreamOptions extends GetFileStreamOptions {
  autoFields?: boolean;
}

export enum RouteParamtypes {
  REQUEST,
  RESPONSE,
  NEXT,
  BODY,
  QUERY,
  PARAM,
  HEADERS,
  SESSION,
  FILE,
  FILES,
  FILESTREAM,
  FILESSTREAM,
}

interface ParamDataOpts {
  paramData: any;
  def: any;
}

export const extractValue = function extractValue(key: RouteParamtypes, { paramData, def = null }: ParamDataOpts) {
  return async function(ctx: Context, next: any) {
    switch (key) {
      case RouteParamtypes.NEXT:
        return next;
      case RouteParamtypes.BODY:
        return ctx.request._body(paramData, def);

      case RouteParamtypes.PARAM:
        return paramData ? (ctx.params[paramData as string] || def) : ctx.params;

      case RouteParamtypes.QUERY:
        return ctx.request._query(paramData, def);
      case RouteParamtypes.HEADERS:
        return paramData ? ctx.headers[paramData] : ctx.headers;

      case RouteParamtypes.SESSION:
        return ctx.session;
      case RouteParamtypes.FILESTREAM:
        return ctx.getFileStream && ctx.getFileStream(paramData);

      case RouteParamtypes.FILESSTREAM:
        return ctx.multipart && ctx.multipart(paramData);
      default:
        return null;
    }
  };
};

const createPipesRouteParamDecorator = function(type: RouteParamtypes) {
  return (data?: ParamData, def: any = null): ParameterDecorator => (target, key, index) => {
    // 将注入的参数处理储存到 midwayjs 全局的装饰器元数据数据对象中
    // 然后在 midwayjs 自定义的 loader 中载入 Controller 的时候, 取出使用

    // 取值的处理
    // https://github.com/midwayjs/midway/blob/0114510174b83cfa327a8d3dfd7461c99f46397d/packages/midway-web/src/loader/webLoader.ts#L222
    attachPropertyDataToClass(WEB_ROUTER_PARAM_KEY, {
      index,
      type,
      data,
      extractValue: extractValue(type, { paramData: data, def }),
    }, target, key);
  }
};


export const Request = () => (
  createPipesRouteParamDecorator(RouteParamtypes.REQUEST)()
);

export const Response = () => (
  createPipesRouteParamDecorator(RouteParamtypes.RESPONSE)()
);

export const Headers = (property?: string) => (
  createPipesRouteParamDecorator(RouteParamtypes.PARAM)(property)
);

export const Next = () => (
  createPipesRouteParamDecorator(RouteParamtypes.NEXT)()
);

export const Query = (property?: string | string[], def: any = null) => (
  createPipesRouteParamDecorator(RouteParamtypes.QUERY)(property, def)
);

export const Body = (property?: string | string[], def: any = null) => (
  createPipesRouteParamDecorator(RouteParamtypes.BODY)(property, def)
);

export const Param = (property?: string, def: any = null) => (
  createPipesRouteParamDecorator(RouteParamtypes.PARAM)(property, def)
);

export const UploadedFile = (property?: GetFileStreamOptions) => (
  createPipesRouteParamDecorator(RouteParamtypes.FILESTREAM)(property)
);

export const UploadedFiles = (property?: GetFilesStreamOptions) => (
  createPipesRouteParamDecorator(RouteParamtypes.FILESSTREAM)(property)
);
