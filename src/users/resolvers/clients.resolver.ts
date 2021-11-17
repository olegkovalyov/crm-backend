import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {ClientModel} from '../models/client.model';
import {CreateClientInput} from '../inputs/client/create-client.input';
import {ClientService} from '../services/client.service';
import {GetClientsInput} from '../inputs/client/get-clients.input';
import {GraphqlService} from '../services/graphql.service';
import {BadRequestException} from '@nestjs/common';
import {UpdateClientInput} from '../inputs/client/update-client.input';
import {sprintf} from 'sprintf-js';
import {ERR_CLIENT_NOT_FOUND} from '../constants/client.error';

@Resolver('Client')
export class ClientsResolver {

  constructor(
    private readonly clientService: ClientService,
    private readonly graphQlService: GraphqlService,
  ) {
  }

  @Mutation(() => ClientModel)
  async createClient(@Args('createClientInput') createClientData: CreateClientInput): Promise<ClientModel> {
    const client = await this.clientService.createClient(createClientData);
    return this.graphQlService.constructClientModel(client);
  }

  @Query(() => [ClientModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getClients(@Args('getClientsInput') getClientsInput: GetClientsInput): Promise<ClientModel[]> {
    const clients = await this.clientService.getClients(getClientsInput);
    return clients.map(client => this.graphQlService.constructClientModel(client));
  }

  @Query(() => ClientModel)
  async getClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
    const client = await this.clientService.getClientById(id);
    if (!client) {
      throw new BadRequestException(sprintf(ERR_CLIENT_NOT_FOUND, id));
    }
    return this.graphQlService.constructClientModel(client);
  }

  @Mutation(() => ClientModel)
  async updateClient(@Args('updateClientInput') updateData: UpdateClientInput): Promise<ClientModel> {
    const client = await this.clientService.updateClient(updateData);
    return this.graphQlService.constructClientModel(client);
  }

  @Mutation(() => ClientModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
    const client = await this.clientService.deleteClientById(id);
    return this.graphQlService.constructClientModel(client);
  }
}
