import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    private connection: Connection,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
    return user;
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    const users = await this.usersRepository.createQueryBuilder('user')
      .where('user.id IN(:...ids)', { ids: ids })
      .getMany();
    return users;
  }
}
