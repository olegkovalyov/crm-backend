import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    UsersModule,
  ],
})
export class AppModule {
}
