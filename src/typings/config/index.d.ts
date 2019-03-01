
import { EggAppConfig } from 'egg';
import ExportConfigDefault, { customizeConfig } from '../../config/config.default';

type ConfigDefault = ReturnType<typeof ExportConfigDefault>;
export type NewEggAppConfig = EggAppConfig & typeof ExportConfigDefault & typeof customizeConfig;
export {
  EggAppConfig
};

declare module 'egg' {
  interface Application {
    config: NewEggAppConfig;
  }
}
