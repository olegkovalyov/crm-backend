import {Module} from '@nestjs/common';
import {ApiGatewayService} from './services/api-gateway.service';

@Module({
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {
}
