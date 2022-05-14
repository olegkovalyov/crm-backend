import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserCredentialsEntity} from '../../entities/user-credentials.entity';

@Injectable()
export class UserCredentialsLoadService {
  constructor(
    @InjectRepository(UserCredentialsEntity)
    private readonly userCredentialsRepository: Repository<UserCredentialsEntity>,
  ) {
  }

  async loadByUserId(id: number): Promise<UserCredentialsEntity | null> {
    try {
      const credentials = await this.userCredentialsRepository.findOne({where: {user: {id}} });
      return credentials ?? null;
    } catch (e) {
      return null;
    }
  }
}
