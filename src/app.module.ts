import { Module } from '@nestjs/common';
import { MembersModule } from './members/membersModule';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
    MembersModule,
    EventsModule,
  ],
})
export class AppModule {
}
