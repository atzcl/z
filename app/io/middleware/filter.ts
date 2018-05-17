import { Context } from 'egg';

export default function filterIOMiddleware () {
  return async (ctx: Context, next: () => Promise<any>) => {
    console.log(ctx);
    await next();
  };
}
