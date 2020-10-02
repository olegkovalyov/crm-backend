import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PassengerModel } from '../models/passenger.model';
import { CreatePassengerInput } from '../inputs/create-passenger.input';
import { IPassenger } from '../interfaces/passenger.interface';
import { PassengerService } from '../services/passenger.service';
import { UpdatePassengerInput } from '../inputs/update-passenger.input';
import { EventService } from '../services/event.service';

@Resolver(of => PassengerModel)
export class PassengerResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly passengerService: PassengerService,
  ) {
  }

  @Query(returns => [PassengerModel], { nullable: 'items' })
  async getPassengers(): Promise<IPassenger[]> {
    return this.passengerService.getPassengers();
  }

  @Mutation(returns => PassengerModel)
  async createPassenger(@Args('createPassengerData') createData: CreatePassengerInput): Promise<IPassenger> {
    return this.passengerService.createPassenger(createData);
  }

  @Mutation(returns => PassengerModel)
  async updatePassenger(@Args('updatePassengerData') updateData: UpdatePassengerInput): Promise<IPassenger> {
    return this.passengerService.updatePassenger(updateData);
  }

  @Mutation(returns => PassengerModel, { nullable: true })
  async removePassenger(@Args('id') id: string) {
    return this.passengerService.removePassengerById(id);
  }
}
