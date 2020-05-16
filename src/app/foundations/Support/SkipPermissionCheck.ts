import { isStr, isArr } from '../Utils';


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SkipPermissionCheck {
  protected static routePaths: string[] = [];

  protected static addRoutePaths(path: string) {
    if (isStr(path) && ! this.routePaths.includes(path)) {
      this.routePaths.push(path)
    }
  }

  static getRoutePaths() {
    return this.routePaths;
  }

  static addWildRoute(path: string) {
    this.addRoutePaths(path + '(/.+)?');
  }

  static add(path: string | string[]) {
    isArr(path) ? path.forEach(url => this.addRoutePaths(url)) : this.addRoutePaths(path);
  }
}
