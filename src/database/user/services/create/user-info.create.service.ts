import {Injectable} from '@nestjs/common';
import {DeepPartial, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserInfoEntity} from '../../entities/user-info.entity';

@Injectable()
export class UserInfoCreateService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
  ) {
  }

  createUserInfo(): UserInfoEntity {
    return this.userInfoRepository.create();
  }

  createUserInfoFromInput(input: DeepPartial<UserInfoEntity>): UserInfoEntity {
    return this.userInfoRepository.create(input);
  }
}
