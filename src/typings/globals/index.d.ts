type ExtendInterface<T> = {
  [P in keyof T]: T[P];
}

interface GlobalMiddlewareNameObject {
  //
}

interface GlobalControllerRouterOptions {
  sensitive?: boolean;
  middleware: GlobalMiddlewareNames;
}

type GlobalMiddlewareNames = (keyof GlobalMiddlewareNameObject)[] | undefined;

interface GlobalValidateIdentifierObject {
  //
}

type GlobalValidateIdentifier = keyof GlobalValidateIdentifierObject;

interface AnyObject { [k: string]: any, }
