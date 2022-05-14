import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {CryptoService} from './services/crypto.service';

@Module({
  imports: [
    DatabaseModule,
  ],
  exports: [
    // Modules
    DatabaseModule,
    // Services
    CryptoService,
  ],
  providers: [
    CryptoService,
  ],
})
export class CoreModule {
}
