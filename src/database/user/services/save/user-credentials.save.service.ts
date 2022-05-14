import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserCredentialsEntity} from '../../entities/user-credentials.entity';

@Injectable()
export class UserCredentialsSaveService {
  constructor(
    @InjectRepository(UserCredentialsEntity)
    private readonly userCredentialsEntityRepository: Repository<UserCredentialsEntity>,
  ) {
  }

  async save(credentials: UserCredentialsEntity): Promise<UserCredentialsEntity | null> {
    try {
      credentials.updatedAt = new Date();
      const credentialsEntity = await this.userCredentialsEntityRepository.save(credentials);
      return credentialsEntity ?? null;
    } catch (e) {
      return null;
    }
  }
}
