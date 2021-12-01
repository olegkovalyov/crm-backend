import {ConfigModuleOptions} from '@nestjs/config';

export function initConfigOptions(): ConfigModuleOptions {
  return {
    isGlobal: true,
    envFilePath: '.env',
  };
}