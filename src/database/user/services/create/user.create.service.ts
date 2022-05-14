import {Injectable} from '@nestjs/common';
import {DeepPartial, Repository} from 'typeorm';
import {UserEntity} from '../../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';

// import {User} from '../entities/auth.entity';

@Injectable()
export class UserCreateService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  createUser(): UserEntity {
    return this.userRepository.create();
  }

  createUserFromInput(input: DeepPartial<UserEntity>): UserEntity {
    return this.userRepository.create(input);
  }
}
