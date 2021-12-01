import {JwtModuleAsyncOptions} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';

export function initJwtOptions(): JwtModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: {expiresIn: 3600 * 24},
    }),
  };
}