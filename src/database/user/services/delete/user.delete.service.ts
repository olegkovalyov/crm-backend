import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {UserEntity} from '../../entities/user.entity';
import {InjectRepository} from '@nestjs/typeorm';

// import {User} from '../entities/auth.entity';

@Injectable()
export class UserDeleteService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async deleteById(id: number): Promise<boolean> {
    try {
      const result = await this.userRepository.delete({id});
      return result.affected === 1;
    } catch (e) {
      return false;
    }
  }

}
