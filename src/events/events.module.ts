import { Module } from '@nestjs/common';
import { EventResolver } from './resolvers/event.resolver';
import { EventService } from './services/event.service';
import { LoadService } from './services/load.service';
import { LoadResolver } from './resolvers/load.resolver';
import { CoreModule } from '../core/core.module';
import { UsersModule } from '../users/usersModule';
import { MemberService } from '../users/services/member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Load } from './entities/load.entity';
import { ClientService } from '../users/services/client.service';
import { UserService } from '../users/services/user.service';
import { Slot } from './entities/slot.entity';

@Module({
  imports: [
    CoreModule,
    // MongooseModule.forFeature(
    //   [
    //     { name: 'Event', schema: EventSchema },
    //     { name: 'Load', schema: LoadSchema },
    //   ],
    // ),
    TypeOrmModule.forFeature([
      Event,
      Load,
      Slot,
    ]),
    UsersModule,
  ],
  providers: [
    EventService,
    EventResolver,
    LoadService,
    LoadResolver,
    UserService,
    MemberService,
    ClientService
  ],
})
export class EventsModule {
}
