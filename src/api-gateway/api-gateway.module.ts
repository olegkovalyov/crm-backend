import {Module} from '@nestjs/common';
// import {TypeOrmModule} from '@nestjs/typeorm';
import {HashService} from './application/contracts/hash.service';
import {BcryptService} from './infrastructure/bcrypt.service';
import {CoreModule} from '../core/core.module';
import {AuthResolver} from './presentation/auth/resolvers/auth.resolver';

@Module({
  imports: [
    CoreModule,
    // TypeOrmModule.forFeature([Auth]),
  ],
  providers: [
    AuthResolver,
    {
      provide: HashService,
      useClass: BcryptService,
    },
  ],
})
export class ApiGatewayModule {
}
