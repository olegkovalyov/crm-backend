import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {ClientService} from '../services/client.service';

@Resolver('Client')
export class ClientResolver {

  constructor(
    private readonly clientService: ClientService,
  ) {
  }

  // @Mutation(() => ClientModel)
  // async createClient(@Args('createClientInput') createClientData: CreateClientInput): Promise<ClientModel> {
  //   const client = await this.clientService.createClient(createClientData);
  //   return this.graphQlService.constructClientModel(client);
  // }
  //
  // @Query(() => [ClientModel])
  // // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  // async getClients(@Args('getClientsInput') getClientsInput: GetClientsInput): Promise<ClientModel[]> {
  //   const clients = await this.clientService.getClients(getClientsInput);
  //   return clients.map(client => this.graphQlService.constructClientModel(client));
  // }
  //
  // @Query(() => ClientModel)
  // async getClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
  //   const client = await this.clientService.getClientById(id);
  //   if (!client) {
  //     throw new BadRequestException(sprintf(ERR_CLIENT_NOT_FOUND, id));
  //   }
  //   return this.graphQlService.constructClientModel(client);
  // }
  //
  // @Mutation(() => ClientModel)
  // async updateClient(@Args('updateClientInput') updateData: UpdateClientInput): Promise<ClientModel> {
  //   const client = await this.clientService.updateClient(updateData);
  //   return this.graphQlService.constructClientModel(client);
  // }
  //
  // @Mutation(() => ClientModel)
  // // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  // async deleteClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
  //   const client = await this.clientService.deleteClientById(id);
  //   return this.graphQlService.constructClientModel(client);
  // }
}
