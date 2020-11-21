import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/usersModule';

@Module({
  imports: [
    EventsModule,
    UsersModule,
  ],
})
export class AppModule {
}
