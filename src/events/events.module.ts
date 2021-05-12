import {Module} from '@nestjs/common';
import {EventResolver} from './resolvers/event.resolver';
import {EventService} from './services/event.service';
import {LoadService} from './services/load.service';
import {LoadResolver} from './resolvers/load.resolver';
import {CoreModule} from '../core/core.module';
import {UsersModule} from '../users/usersModule';
import {MemberService} from '../users/services/member.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Event} from './entities/event.entity';
import {Load} from './entities/load.entity';
import {ClientService} from '../users/services/client.service';
import {UserService} from '../users/services/user.service';
import {Slot} from './entities/slot.entity';
import {SlotService} from './services/slot.service';
import {SlotResolver} from './resolvers/slot.resolver';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([
      Event,
      Load,
      Slot,
    ]),
    UsersModule,
  ],
  providers: [
    EventResolver,
    LoadResolver,
    SlotResolver,
    UserService,
    ClientService,
    LoadService,
    EventService,
    MemberService,
    SlotService,
  ],
})
export class EventsModule {
}
