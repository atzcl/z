import { Context } from 'egg';

export default function filterIOMiddleware () {
  return async (ctx: Context, next: () => Promise<any>) => {
    await next();
  };
}
