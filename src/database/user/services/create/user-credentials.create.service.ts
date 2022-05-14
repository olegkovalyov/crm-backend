import {Injectable} from '@nestjs/common';
import {DeepPartial, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserCredentialsEntity} from '../../entities/user-credentials.entity';

@Injectable()
export class UserCredentialsCreateService {
  constructor(
    @InjectRepository(UserCredentialsEntity)
    private readonly userCredentialsRepository: Repository<UserCredentialsEntity>,
  ) {
  }

  createUserCredentials(): UserCredentialsEntity {
    return this.userCredentialsRepository.create();
  }

  createUserCredentialsFromInput(input: DeepPartial<UserCredentialsEntity>): UserCredentialsEntity {
    return this.userCredentialsRepository.create(input);
  }
}
