import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientModel } from '../models/client.model';
import { CreateClientInput } from '../inputs/create-client.input';
import { ClientInterface } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { UpdateClientInput } from '../inputs/update-client.input';
import { EventService } from '../services/event.service';
import { GetClientsFilterInput } from '../inputs/get-clients-filter.input';

@Resolver(of => ClientModel)
export class ClientResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly clientService: ClientService,
  ) {
  }

  @Query(returns => [ClientModel])
  async getClients(@Args('getClientsFilterInput') getClientsFilterInput: GetClientsFilterInput): Promise<ClientInterface[]> {
    return this.clientService.getClients(getClientsFilterInput);
  }

  @Mutation(returns => ClientModel)
  async createClient(@Args('createClientData') createData: CreateClientInput): Promise<ClientInterface> {
    return this.clientService.createClient(createData);
  }

  @Mutation(returns => ClientModel)
  async updateClient(@Args('updateClientData') updateData: UpdateClientInput): Promise<ClientInterface> {
    return this.clientService.updateClient(updateData);
  }

  @Mutation(returns => ClientModel, { nullable: true })
  async deleteClient(@Args('id') id: string) {
    return this.clientService.deleteClientById(id);
  }

  @Query(returns => ClientModel, { nullable: true })
  async getClient(@Args('id') id: string): Promise<ClientInterface> {
    return this.clientService.getClientById(id);
  }
}
