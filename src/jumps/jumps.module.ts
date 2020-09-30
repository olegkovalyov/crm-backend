import { Module } from '@nestjs/common';
import { JumpsService } from './jumps.service';
import { JumpsResolver } from './jumps.resolver';
import { PassengerService } from './passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassengerSchema } from './schemas/passenger.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'Passenger', schema: PassengerSchema },
      ],
    ),
    UsersModule,
  ],
  providers: [
    JumpsService,
    JumpsResolver,
    PassengerService,
  ],
})
export class JumpsModule {
}
