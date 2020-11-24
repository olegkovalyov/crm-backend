import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { EventResolver } from './resolvers/event.resolver';
import { EventService } from './services/event.service';
import { LoadService } from './services/load.service';
import { LoadResolver } from './resolvers/load.resolver';
import { LoadSchema } from './schemas/load.schema';
import { CoreModule } from '../core/core.module';
import { UsersModule } from '../users/usersModule';
import { MembersService } from '../users/services/members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Member } from '../users/entities/member.entity';
import { Client } from '../users/entities/client.entity';
import { Event } from './entities/event.entity';

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
    ]),
    UsersModule,
  ],
  providers: [
    EventService,
    EventResolver,
    LoadService,
    LoadResolver,
    MembersService,
  ],
})
export class EventsModule {
}
