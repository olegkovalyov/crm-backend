import { Module } from '@nestjs/common';
import { ClientResolver } from './resolvers/client.resolver';
import { ClientService } from './services/client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './schemas/client.schema';
import { EventSchema } from './schemas/event.schema';
import { EventResolver } from './resolvers/event.resolver';
import { EventService } from './services/event.service';
import { LoadService } from './services/load.service';
import { LoadResolver } from './resolvers/load.resolver';
import { LoadSchema } from './schemas/load.schema';
import { CoreModule } from '../core/core.module';
import { UsersModule } from '../users/usersModule';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forFeature(
      [
        { name: 'Event', schema: EventSchema },
        { name: 'Load', schema: LoadSchema },
        { name: 'Client', schema: ClientSchema },
      ],
    ),
    UsersModule,
  ],
  providers: [
    EventService,
    EventResolver,
    LoadService,
    LoadResolver,
    ClientResolver,
    ClientService,
  ],
})
export class EventsModule {
}
