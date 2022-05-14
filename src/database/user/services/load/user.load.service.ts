import {Injectable} from '@nestjs/common';
import {FindOptionsWhere, Repository} from 'typeorm';
import {UserEntity} from '../../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserLoadService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async loadById(id: number): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOne({where: {id: id}});
      return user ?? null;
    } catch (e) {
      return null;
    }
  }

  async loadByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({where: {email}});
      return user ?? null;
    } catch (e) {
      return null;
    }
  }

  async loadByConditions(conditions: FindOptionsWhere<UserEntity>): Promise<UserEntity[]> {
    try {
      return this.userRepository.find({
        relations: ['userInfo'],
        where: conditions,
      });
    } catch (e) {
      return [];
    }
  }
}
