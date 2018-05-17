// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import { EggAppConfig } from 'egg';
import ExportConfigLocal from '../../config/config.local';
type ConfigLocal = ReturnType<typeof ExportConfigLocal>;
type NewEggAppConfig = EggAppConfig & ConfigLocal;

declare module 'egg' {
  interface Application {
    config: NewEggAppConfig;
  }

  interface Controller {
    config: NewEggAppConfig;
  }

  interface Service {
    config: NewEggAppConfig;
  }
}