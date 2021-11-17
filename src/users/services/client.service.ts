import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {FindOperator, Like, Raw, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Client} from '../entities/client.entity';
import {CreateClientInput} from '../inputs/client/create-client.input';
import {GetClientsInput} from '../inputs/client/get-clients.input';

import {v4 as uuidv4} from 'uuid';
import {
  ClientRole,
  ClientStatus, Gender,
  GetClientsFilterConditionInterface,
  PaymentStatus,
} from '../interfaces/client.interface';
import {UpdateClientInput} from '../inputs/client/update-client.input';
import {sprintf} from 'sprintf-js';
import {
  ERR_CLIENT_ALREADY_EXIST,
  ERR_CLIENT_NOT_FOUND,
  ERR_FAILED_TO_CREATE_CLIENT,
  ERR_FAILED_TO_DELETE_CLIENT,
} from '../constants/client.error';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {
  }

  async createClient(input: CreateClientInput): Promise<Client> {
    const {
      role,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      weight,
      status,
      paymentStatus,
      additionalInfo,
      certificate,
    } = input;

    const alreadyExist = await this.clientsRepository.findOne({phone});
    if (alreadyExist) {
      throw new BadRequestException(sprintf(ERR_CLIENT_ALREADY_EXIST, phone));
    }

    const client = new Client();
    client.personId = uuidv4();
    client.firstName = firstName;
    client.lastName = lastName;
    client.dateOfBirth = dateOfBirth;
    client.phone = phone;
    client.role = role;
    client.gender = gender;
    client.email = email;
    client.weight = weight;
    client.status = status;
    client.paymentStatus = paymentStatus;
    client.additionalInfo = additionalInfo;
    client.certificate = certificate;

    try {
      return this.clientsRepository.save(client);
    } catch (e) {
      throw new InternalServerErrorException(ERR_FAILED_TO_CREATE_CLIENT);
    }
  }

  async getClients(filterParams: GetClientsInput): Promise<Client[]> {
    const conditions = ClientService.composeSearchConditions(filterParams);

    return this.clientsRepository.find({
      where: conditions,
    });
  }

  private static composeSearchConditions(filterParams: Partial<GetClientsInput>): GetClientsFilterConditionInterface {
    const {
      status,
      role,
      paymentStatus,
      gender,
      minDateOfBirth,
      maxDateOfBirth,
      firstName,
      lastName,
      email,
      certificate,
      minCreatedAt,
      maxCreatedAt,
      minProcessedAt,
      maxProcessedAt,
    } = filterParams;
    const conditions: GetClientsFilterConditionInterface = {};

    if (role) {
      conditions.role = ClientService.applyRoleFilter(role);
    }

    if (status) {
      conditions.status = ClientService.applyStatusFilter(status);
    }

    if (paymentStatus) {
      conditions.paymentStatus = ClientService.applyPaymentStatusFilter(paymentStatus);
    }

    if (gender) {
      conditions.gender = ClientService.applyGenderFilter(gender);
    }

    if (minDateOfBirth
      || maxDateOfBirth
    ) {
      conditions.dateOfBirth = ClientService.applyDateFilter(minDateOfBirth, maxDateOfBirth);
    }

    if (firstName
      && firstName.length > 2
    ) {
      conditions.firstName = Like(`%${firstName}%`);
    }

    if (lastName
      && lastName.length > 2
    ) {
      conditions.lastName = Like(`%${lastName}%`);
    }

    if (email
      && email.length > 2
    ) {
      conditions.email = Like(`%${email}%`);
    }

    if (certificate
      && certificate.length > 2
    ) {
      conditions.certificate = Like(`%${certificate}%`);
    }

    if (minCreatedAt
      || maxCreatedAt
    ) {
      conditions.createdAt = ClientService.applyDateFilter(minCreatedAt, maxCreatedAt);
    }

    if (minDateOfBirth
      || maxDateOfBirth
    ) {
      conditions.dateOfBirth = ClientService.applyDateFilter(minDateOfBirth, maxDateOfBirth);
    }

    if (minProcessedAt
      || maxProcessedAt
    ) {
      conditions.processedAt = ClientService.applyDateFilter(minProcessedAt, maxProcessedAt);
    }

    return conditions;
  }

  private static applyRoleFilter(role: ClientRole[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...role)`,
      {
        role,
      },
    );
  }

  private static applyStatusFilter(status: ClientStatus[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...status)`,
      {
        status,
      },
    );
  }

  private static applyPaymentStatusFilter(paymentStatus: PaymentStatus[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...paymentStatus)`,
      {
        paymentStatus,
      },
    );
  }

  private static applyGenderFilter(gender: Gender[]): FindOperator<any> {
    return Raw((alias) => `${alias} IN(:...gender)`,
      {
        gender,
      },
    );
  }

  private static applyDateFilter(
    minDate: Date | undefined,
    maxDate: Date | undefined,
  ): FindOperator<any> {
    let condition: FindOperator<any>;
    if (minDate
      && maxDate
    ) {
      condition = Raw((alias) => `${alias} >= :minDate AND ${alias} <= :maxDate`,
        {
          minDate,
          maxDate,
        },
      );
    } else if (minDate) {
      condition = Raw((alias) => `${alias} >= :minDate`,
        {
          minDate,
        },
      );
    } else {
      condition = Raw((alias) => `${alias} <= :maxDate`,
        {
          maxDate,
        },
      );
    }
    return condition;
  }

  async getClientById(id: number): Promise<Client> {
    return this.clientsRepository.findOne({id});
  }

  async updateClient(updateData: UpdateClientInput): Promise<Client> {
    const {
      id,
      role,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      weight,
      status,
      paymentStatus,
      additionalInfo,
      certificate,
      processedAt,
    } = updateData;

    const client = await this.getClientById(id);
    if (!client) {
      throw new BadRequestException(sprintf(ERR_CLIENT_NOT_FOUND, id));
    }

    if (status) {
      client.status = status;
    }

    if (paymentStatus) {
      client.paymentStatus = paymentStatus;
    }

    if (role) {
      client.role = role;
    }

    if (dateOfBirth) {
      client.dateOfBirth = dateOfBirth;
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

    if (certificate) {
      client.certificate = certificate;
    }

    if (additionalInfo) {
      client.additionalInfo = additionalInfo;
    }

    if (processedAt) {
      client.processedAt = processedAt;
    }

    client.updatedAt = new Date();

    return this.clientsRepository.save(client);
  }

  async deleteClientById(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({id});
    if (!client) {
      throw new BadRequestException(sprintf(ERR_CLIENT_NOT_FOUND, id));
    }
    const deleteResult = await this.clientsRepository.delete({id: client.id});
    if (deleteResult.affected !== 1) {
      throw new InternalServerErrorException(sprintf(ERR_FAILED_TO_DELETE_CLIENT, client.id));
    }
    return client;
  }

}
