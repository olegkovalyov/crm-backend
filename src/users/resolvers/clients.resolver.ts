import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserService} from '../services/user.service';
import {BadRequestException} from '@nestjs/common';
import {AuthService} from '../services/auth.service';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {RandomStringService} from '@akanass/nestjsx-crypto';
import {ClientModel} from '../models/client.model';
import {CreateClientInput} from '../inputs/clients/create-client.input';
import {ClientService} from '../services/client.service';
import {GetClientsFilterInput} from '../inputs/clients/get-clients-filter.input';
import {UpdateClientInput} from '../inputs/clients/update-client.input';
import {GraphqlService} from '../services/graphql.service';
import {NotifyService} from '../services/notify.service';

@Resolver('Client')
export class ClientsResolver {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly notifyService: NotifyService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly randomStringService: RandomStringService,
    private readonly clientService: ClientService,
    private readonly graphQlService: GraphqlService,
  ) {
  }

  @Mutation(returns => ClientModel)
  async createClient(@Args('createClientInput') createClientData: CreateClientInput): Promise<ClientModel> {
    const newClient = await this.clientService.createClient(createClientData);
    return this.clientService.transformToGraphQlClientModel(newClient);
  }

  @Query(returns => ClientModel, {nullable: true})
  async getClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
    const client = await this.clientService.getClientById(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return this.clientService.transformToGraphQlClientModel(client);
  }

  @Query(returns => [ClientModel])
  async getClients(@Args('getClientsFilterInput') getClientsFilterInput: GetClientsFilterInput): Promise<ClientModel[]> {
    const clients = await this.clientService.getClients(getClientsFilterInput);
    return clients.map(client => this.clientService.transformToGraphQlClientModel(client));
  }

  @Mutation(returns => ClientModel)
  async updateClient(@Args('updateClientInput') updateData: UpdateClientInput): Promise<ClientModel> {
    const client = await this.clientService.updateClient(updateData);
    return this.clientService.transformToGraphQlClientModel(client);
  }

  @Mutation(returns => ClientModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteClient(@Args('id', {type: () => Int}) id: number): Promise<ClientModel> {
    const client = await this.clientService.deleteClientById(id);
    return this.clientService.transformToGraphQlClientModel(client);
  }
}
