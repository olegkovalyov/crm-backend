import { Module } from '@nestjs/common';
import { PassengerResolver } from './resolvers/passenger.resolver';
import { PassengerService } from './services/passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassengerSchema } from './schemas/passenger.schema';
import { UsersModule } from '../users/users.module';
import { EventSchema } from './schemas/event.schema';
import { EventResolver } from './resolvers/event.resolver';
import { EventService } from './services/event.service';
import { LoadService } from './services/load.service';
import { LoadResolver } from './resolvers/load.resolver';
import { LoadSchema } from './schemas/load.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'Event', schema: EventSchema },
        { name: 'Load', schema: LoadSchema },
        { name: 'Passenger', schema: PassengerSchema },
      ],
    ),
    UsersModule,
  ],
  providers: [
    EventService,
    EventResolver,
    LoadService,
    LoadResolver,
    PassengerResolver,
    PassengerService,
  ],
})
export class EventsModule {
}
