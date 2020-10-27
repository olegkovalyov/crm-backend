import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClientModel } from '../models/client.model';
import { CreateClientInput } from '../inputs/create-client.input';
import { ClientInterface } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { UpdateClientInput } from '../inputs/update-client.input';
import { EventService } from '../services/event.service';

@Resolver(of => ClientModel)
export class ClientResolver {
  constructor(
    private readonly eventService: EventService,
    private readonly clientService: ClientService,
  ) {
  }

  @Query(returns => [ClientModel], { nullable: 'items' })
  async getClients(): Promise<ClientInterface[]> {
    return this.clientService.getClients();
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
