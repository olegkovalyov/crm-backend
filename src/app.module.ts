import {Module} from '@nestjs/common';
import {UsersModule} from './users/usersModule';
import {EventsModule} from './events/events.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,
  ],
})
export class AppModule {
}
