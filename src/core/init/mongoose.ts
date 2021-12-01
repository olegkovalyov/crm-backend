import {MongooseModuleAsyncOptions} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';

export function initMongooseOptions(): MongooseModuleAsyncOptions {
  return {
    imports: [
      ConfigModule,
    ],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_LINK'),
      autoIndex: true,
    }),
    inject: [ConfigService],
  };
}