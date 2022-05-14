import {TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {RefreshTokenEntity} from '../auth/entities/refresh-token.entity';
import {UserEntity} from '../user/entities/user.entity';
import {UserInfoEntity} from '../user/entities/user-info.entity';
import {ClientEntity} from '../client/entities/client.entity';

export function initTypeOrmOptions(): TypeOrmModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USER'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DATABASE'),
      autoLoadEntities: configService.get<string>('POSTGRES_AUTOLOAD_ENTITIES') === 'true',
      synchronize: configService.get<string>('POSTGRES_ENTITY_SYNC') === 'true',
    }),
  };
}