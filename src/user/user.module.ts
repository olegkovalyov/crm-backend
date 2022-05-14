import {Module} from '@nestjs/common';
import {UserResolver} from './resolvers/user.resolver';
import {UserService} from './services/user.service';
import {CoreModule} from '../core/core.module';
import {CommonModule} from '../common/common.module';
import {OrderCreatedListener} from './services/oder.listener';
import {TestHandler} from './services/test.handler';
import {CommandBus, CqrsModule} from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    CoreModule,
    CommonModule,
  ],
  providers: [
    UserService,
    UserResolver,
    OrderCreatedListener,
    TestHandler,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {
}
