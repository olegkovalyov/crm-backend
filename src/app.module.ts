import {Module} from '@nestjs/common';
import {AccountsModule} from './accounts/accounts.module';
import {CoreModule} from './core/core.module';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';

@Module({
  imports: [
    CoreModule,
    AccountsModule,
    ApiGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
