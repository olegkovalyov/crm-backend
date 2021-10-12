import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Connection, QueryRunner, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../entities/user.entity';
import {Client} from '../entities/client.entity';
import {CreateClientInput} from '../inputs/clients/create-client.input';
import {GetClientsFilterInput} from '../inputs/clients/get-clients-filter.input';
import {UpdateClientInput} from '../inputs/clients/update-client.input';
import {ClientModel} from '../models/client.model';

@Injectable()
export class ClientService {
  private queryRunner: QueryRunner;

  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {
  }

  async getClients(filterParams: GetClientsFilterInput): Promise<Client[]> {
    const clientsQueryBuilder = this.clientsRepository.createQueryBuilder('client');

    clientsQueryBuilder.leftJoinAndSelect('client.user', 'user');
    clientsQueryBuilder.leftJoinAndSelect('client.tm', 'tm');
    clientsQueryBuilder.leftJoinAndSelect('client.cameraman', 'cameraman');
    if (filterParams.clientStatusOptions
      || (filterParams.isAssigned !== null
        && filterParams.isAssigned !== undefined)
      || filterParams.createdAtMax
      || filterParams.createdAtMin
    ) {
      const queryParts = [];
      const queryParameters = [];

      if (filterParams.clientStatusOptions
        && filterParams.clientStatusOptions.length
      ) {
        queryParts.push('client.status IN(:...clientStatuses)');
        queryParameters.push({clientStatuses: filterParams.clientStatusOptions});
      }

      if (filterParams.isAssigned !== null
        && filterParams.isAssigned !== undefined
      ) {
        queryParts.push('client.isAssigned =:isAssigned');
        queryParameters.push({isAssigned: filterParams.isAssigned});
      }

      if (filterParams.createdAtMin) {
        queryParts.push('client.createdAt >= :dateMin ');
        queryParameters.push({dateMin: filterParams.createdAtMin});
      }

      if (filterParams.createdAtMax) {
        queryParts.push('client.createdAt < :dateMax ');
        queryParameters.push({dateMax: filterParams.createdAtMax});
      }

      for (let i = 0; i < queryParts.length; i++) {
        if (i === 0) {
          clientsQueryBuilder.where(queryParts[i], queryParameters[i]);
        } else {
          clientsQueryBuilder.andWhere(queryParts[i], queryParameters[i]);
        }
      }
    }

    return clientsQueryBuilder.getMany();
  }

  async createClient(createClientInput: CreateClientInput): Promise<Client> {
    const {
      role,
      status,
      gender,
      age,
      firstName,
      lastName,
      email,
      weight,
      phone,
      address,
      withHandCameraVideo,
      withCameraman,
      notes,
      certificate,
    } = createClientInput;

    const client = await this.getClientByEmail(email);
    if (client) {
      throw new BadRequestException('Client with this email already exists');
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const user = new User();
      await this.queryRunner.manager.save(user);

      const newClient = new Client();
      newClient.user = user;
      newClient.role = role;
      newClient.status = status;
      newClient.gender = gender;
      newClient.age = age;
      newClient.weight = weight;
      newClient.firstName = firstName;
      newClient.lastName = lastName;
      newClient.email = email;
      newClient.phone = phone;
      newClient.address = address;
      newClient.certificate = certificate;
      newClient.notes = notes;
      newClient.withCameraman = withCameraman;
      newClient.withHandCameraVideo = withHandCameraVideo;

      const result = await this.queryRunner.manager.save(newClient);
      await this.queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create client');
    } finally {
      await this.queryRunner.release();
    }
  }

  async getClientByEmail(email: string): Promise<Client> {
    return this.clientsRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('client.email = :email', {email: email})
      .getOne();
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientsRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.tm', 'tm')
      .leftJoinAndSelect('client.cameraman', 'cameraman')
      .where('client.id = :id', {id: id})
      .getOne();
    return client;
  }

  async updateClient(updateData: UpdateClientInput): Promise<Client> {
    const {
      id,
      role,
      status,
      gender,
      age,
      firstName,
      lastName,
      email,
      weight,
      phone,
      address,
      withHandCameraVideo,
      withCameraman,
      notes,
      certificate,
    } = updateData;

    const client = await this.getClientById(id);

    if (!client) {
      throw new BadRequestException(`Client with id: ${id} doesnt exists`);
    }

    if (status) {
      client.status = status;
    }

    if (role) {
      client.role = role;
    }

    if (age) {
      client.age = age;
    }

    if (gender) {
      client.gender = gender;
    }

    if (weight) {
      client.weight = weight;
    }

    if (firstName) {
      client.firstName = firstName;
    }

    if (lastName) {
      client.lastName = lastName;
    }

    if (email) {
      client.email = email;
    }

    if (phone) {
      client.phone = phone;
    }

    if (email) {
      client.email = email;
    }

    if (address) {
      client.address = address;
    }

    if (withHandCameraVideo !== undefined) {
      client.withHandCameraVideo = withHandCameraVideo;
    }

    if (withCameraman !== undefined) {
      client.withCameraman = withCameraman;
    }

    if (notes) {
      client.notes = notes;
    }

    if (certificate) {
      client.certificate = certificate;
    }

    return this.clientsRepository.save(client);
  }

  async deleteClientById(id: number): Promise<Client> {
    const client = await this.getClientById(id);
    if (!client) {
      throw new BadRequestException(`Client with id: ${id} doesn't exists`);
    }

    this.queryRunner = this.connection.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const clientDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(Client)
        .where('id = :id', {id: id})
        .execute();

      const userDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', {id: client.user.id})
        .execute();
      await this.queryRunner.commitTransaction();
      if (clientDeleteResult.affected !== 1
        && userDeleteResult.affected !== 1
      ) {
        throw new BadRequestException(`Failed to delete client with id: ${id}`);
      }
      return client;
    } catch (e) {
      await this.queryRunner.rollbackTransaction();
      throw new BadRequestException(`Failed to delete client with id: ${id}`);
    } finally {
      await this.queryRunner.release();
    }
  }

  async getClientByUserId(userId: number): Promise<Client> {
    const client = await this.clientsRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('client.userId = :userId', {userId: userId})
      .getOne();
    return client;
  }

  async setAssignedStatus(client: Client): Promise<Client> {
    client.isAssigned = true;
    return await this.clientsRepository.save(client);
  }

  async deleteAssignedStatus(client: Client): Promise<Client> {
    client.isAssigned = false;
    return await this.clientsRepository.save(client);
  }

  transformToGraphQlClientModel(client: Client): ClientModel {
    return {
      id: client.id,
      userId: client.user.id,
      status: client.status,
      role: client.role,
      gender: client.gender,
      age: client.age,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      weight: client.weight,
      phone: client.phone,
      address: client.address,
      withHandCameraVideo: client.withHandCameraVideo,
      withCameraman: client.withCameraman,
      notes: client.notes,
      certificate: client.certificate,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      processedAt: client.processedAt,
    };
  }

}
