import {CreateClientInput} from '../inputs/client/create-client.input';
import {ClientService} from './client.service';
import {Client} from '../entities/client.entity';
import {Repository} from 'typeorm';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {ClientRole, ClientStatus, Gender, PaymentStatus} from '../interfaces/client.interface';
import {ERR_CLIENT_ALREADY_EXIST, ERR_FAILED_TO_CREATE_CLIENT} from '../constants/client.error';
import {sprintf} from 'sprintf-js';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('ClientService', () => {
  let clientService: ClientService;
  let clientRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      {
        providers: [
          ClientService,
          {
            provide: getRepositoryToken(Client),
            useValue: createMockRepository(),
          },
        ],
      },
    ).compile();

    clientService = module.get<ClientService>(ClientService);
    clientRepository = module.get<MockRepository>(getRepositoryToken(Client));
  });

  describe('CreateClient', () => {
    it('Success', async () => {
      const input = getInputForCreate();
      clientRepository.findOne.mockReturnValue(undefined);
      clientRepository.save.mockImplementation(async (input: CreateClientInput) => {
        const client = new Client();
        client.email = input.email;
        return client;
      });
      const client = await clientService.createClient(input);
      expect(client.email).toEqual(input.email);
    });

    it('Already exist', async () => {
      const input = getInputForCreate();
      clientRepository.findOne.mockImplementation(() => {
        return new Client();
      });
      try {
        const client = await clientService.createClient(input);
      } catch (e) {
        expect(e.message).toEqual(sprintf(ERR_CLIENT_ALREADY_EXIST, input.phone));
      }
    });

    it('Database error', async () => {
      const input = getInputForCreate();
      clientRepository.findOne.mockReturnValue(undefined);
      clientRepository.save.mockImplementation(() => {
        throw new Error();
      });
      try {
        const client = await clientService.createClient(input);
      } catch (e) {
        expect(e.message).toEqual(ERR_FAILED_TO_CREATE_CLIENT);
      }
    });
  });

});

function getInputForCreate(): CreateClientInput {
  const input = new CreateClientInput();
  input.firstName = 'John';
  input.lastName = 'Doe';
  input.phone = '+3999999999';
  input.paymentStatus = PaymentStatus.PAID;
  input.dateOfBirth = new Date('1980-10-10');
  input.certificate = '123456789';
  input.additionalInfo = '';
  input.status = ClientStatus.PENDING;
  input.weight = 80;
  input.role = ClientRole.TANDEM;
  input.email = 'johndoe@test.com';
  input.gender = Gender.MALE;
  return input;
}