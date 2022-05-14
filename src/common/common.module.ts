import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {initMailerOptions} from './config/mailer.config';
import {RandomStringService} from './services/random-string.service';
import {NotifyService} from './services/notify.service';
import {GraphqlService} from './services/graphql.service';

@Module({
  providers: [
    RandomStringService,
    NotifyService,
    GraphqlService,
  ],
  exports: [
    // Services
    RandomStringService,
    NotifyService,
    GraphqlService,
  ],
})
export class CommonModule {
}
