import {Module} from '@nestjs/common';
import {CoreModule} from '../core/core.module';
import {AuthResolver} from './presentation/auth/resolvers/auth.resolver';
import {RegisterCommandHandler} from './application/auth/commands/handlers/register.command.handler';
import {LoginCommandHandler} from './application/auth/commands/handlers/login.command.handler';

@Module({
  imports: [
    CoreModule,
  ],
  providers: [
    AuthResolver,
    RegisterCommandHandler,
    LoginCommandHandler,
  ],
})
export class ApiGatewayModule {
}
