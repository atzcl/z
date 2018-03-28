import { Context } from 'egg'

module.exports = () => {
  return async (ctx: Context, next: Function) => {
    console.log(222)
    await next()
  }
}
