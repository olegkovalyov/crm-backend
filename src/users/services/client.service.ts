import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
import { UserType } from '../interfaces/user.interface';
import { CreateClientInput } from '../inputs/clients/create-client.input';
import { GetClientsFilterInput } from '../inputs/clients/get-clients-filter.input';
import { UpdateClientInput } from '../inputs/clients/update-client.input';
import { Member } from '../entities/member.entity';
import { MemberModel } from '../models/member.model';
import { ClientModel } from '../models/client.model';

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

    console.log(filterParams);
    const clientsQueryBuilder = this.clientsRepository.createQueryBuilder('client');

    clientsQueryBuilder.leftJoinAndSelect('client.user', 'user');
    clientsQueryBuilder.leftJoinAndSelect('client.tm', 'tm');
    clientsQueryBuilder.leftJoinAndSelect('client.cameraman', 'cameraman');
    if (filterParams.clientStatuses
      || filterParams.paymentStatuses
      || filterParams.createdAtMax
      || filterParams.createdAtMin
    ) {
      const queryParts = [];
      const queryParameters = [];

      if (filterParams.clientStatuses
        && filterParams.clientStatuses.length
      ) {
        queryParts.push('client.status IN(:...clientStatuses)');
        queryParameters.push({ clientStatuses: filterParams.clientStatuses });
      }

      if (filterParams.paymentStatuses
        && filterParams.paymentStatuses.length
      ) {
        queryParts.push('client.paymentStatus IN(:...paymentStatuses)');
        queryParameters.push({ paymentStatuses: filterParams.paymentStatuses });
      }

      if (filterParams.createdAtMin) {
        queryParts.push('client.createdAt >= :dateMin ');
        queryParameters.push({ dateMin: filterParams.createdAtMin });
      }

      if (filterParams.createdAtMax) {
        queryParts.push('client.createdAt < :dateMax ');
        queryParameters.push({ dateMax: filterParams.createdAtMax });
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
      type,
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
      paymentStatus,
      tmId,
      cameramanId,
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
      user.userType = UserType.CLIENT;
      await this.queryRunner.manager.save(user);

      const newClient = new Client();
      newClient.user = user;
      newClient.type = type;
      newClient.status = status;
      newClient.paymentStatus = paymentStatus;
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

      if (tmId) {
        const tm = await this.usersRepository
          .createQueryBuilder('user')
          .where('user.id = :id', { id: tmId })
          .getOne();
        if (tm) {
          newClient.tm = tm;
        }
      }

      if (cameramanId) {
        const cameraman = await this.usersRepository
          .createQueryBuilder('user')
          .where('user.id = :id', { id: cameramanId })
          .getOne();
        if (cameraman) {
          newClient.cameraman = cameraman;
        }
      }

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
      .where('client.email = :email', { email: email })
      .getOne();
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientsRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.tm', 'tm')
      .leftJoinAndSelect('client.cameraman', 'cameraman')
      .where('client.id = :id', { id: id })
      .getOne();
    return client;
  }

  async updateClient(updateData: UpdateClientInput): Promise<Client> {
    const {
      id,
      type,
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
      paymentStatus,
      tmId,
      cameramanId,
      processedAt,
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

    if (type) {
      client.type = type;
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

    if (paymentStatus) {
      client.paymentStatus = paymentStatus;
    }


    if (tmId) {
      const tm = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: tmId })
        .getOne();
      client.tm = tm;
    }

    if (cameramanId) {
      const cameraman = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: cameramanId })
        .getOne();
      client.cameraman = cameraman;
    }

    if (processedAt) {
      client.processedAt = processedAt;
    }

    if (notes) {
      client.notes = notes;
    }

    if (certificate) {
      client.certificate = certificate;
    }

    return this.clientsRepository.save(client);
  }

  async deleteClientById(id: number): Promise<boolean> {
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
        .where('id = :id', { id: id })
        .execute();

      const userDeleteResult = await this.queryRunner.connection
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id: client.user.id })
        .execute();
      await this.queryRunner.commitTransaction();
      return clientDeleteResult.affected == 1
        && userDeleteResult.affected == 1;

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
      .where('client.userId = :userId', { userId: userId })
      .getOne();
    return client;
  }

  transformToGraphQlClientModel(client: Client): ClientModel {
    return {
      id: client.id,
      userId: client.user.id,
      status: client.status,
      paymentStatus: client.paymentStatus,
      type: client.type,
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
      tm: client.tm,
      cameraman: client.cameraman,
      createdAt: client.createdAt,
      processedAt: client.processedAt,
    };
  }

}
