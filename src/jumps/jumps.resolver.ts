import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JumpsService } from './jumps.service';
import { PassengerModel } from './models/passenger.model';
import { CreatePassengerInput } from './inputs/create-passenger.input';
import { IPassenger } from './interfaces/passenger.interface';
import { PassengerService } from './passenger.service';
import { UpdatePassengerInput } from './inputs/update-passenger.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver('Jumps')
export class JumpsResolver {
  constructor(
    private readonly jumpsService: JumpsService,
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
