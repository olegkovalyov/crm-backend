import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {ClientService} from './services/client.service';
import {ClientResolver} from './resolvers/client.resolver';

@Module({
  imports: [
    CommonModule,
  ],
  providers: [
    ClientService,
    ClientResolver,
  ],
})
export class ClientModule {
}
