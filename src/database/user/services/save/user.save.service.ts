import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {UserEntity} from '../../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserSaveService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async save(user: UserEntity): Promise<UserEntity | null> {
    try {
      user.updatedAt = new Date();
      const updatedUser = await this.userRepository.save(user);
      return updatedUser.excludeCredentials() ?? null;
    } catch (e) {
      return null;
    }
  }
}
