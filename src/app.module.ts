import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { JumpsModule } from './jumps/jumps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    UsersModule,
    JumpsModule,
  ],
})
export class AppModule {
}
