import {Injectable, Scope} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsWhere, Like, Raw} from 'typeorm';
import {UserEntity} from '../../database/user/entities/user.entity';
import {CreateUserInput} from '../inputs/create-user.input';
import {GetUsersInput} from '../inputs/get-users.input';
import {UpdateUserInput} from '../inputs/update-user.input';
import {UserLoadService} from '../../database/user/services/load/user.load.service';
import {CryptoService} from '../../core/services/crypto.service';
import {RandomStringService} from '../../common/services/random-string.service';
import {UserCreateService} from '../../database/user/services/create/user.create.service';
import {UserSaveService} from '../../database/user/services/save/user.save.service';
import {UserInfoCreateService} from '../../database/user/services/create/user-info.create.service';
import {UserDeleteService} from '../../database/user/services/delete/user.delete.service';
import {UserCredentialsCreateService} from '../../database/user/services/create/user-credentials.create.service';
import {EventEmitter2} from '@nestjs/event-emitter';
import {CommandBus} from '@nestjs/cqrs';
import {TestCommand} from './test.command';

@Injectable({scope: Scope.DEFAULT})
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userLoadService: UserLoadService,
    private readonly _userCreateService: UserCreateService,
    private readonly _userSaveService: UserSaveService,
    private readonly _userDeleteService: UserDeleteService,
    private readonly _userInfoCreateService: UserInfoCreateService,
    private readonly _userCredentialsCreateService: UserCredentialsCreateService,
    private readonly _cryptoService: CryptoService,
    private readonly _randomStringService: RandomStringService,
    private readonly eventEmitter: EventEmitter2,
    private readonly commandBus: CommandBus,
  ) {
  }

  async getUsers(filterParams: Partial<GetUsersInput>): Promise<UserEntity[]> {
    const conditions = UserService._composeSearchConditions(filterParams);
    return await this._userLoadService.loadByConditions(conditions);
  }

  async createUser(input: CreateUserInput): Promise<UserEntity | null> {
    const user = this._userCreateService.createUserFromInput(input);
    const salt = await this._cryptoService.generateSalt();

    user.personId = await this._randomStringService.generateId();
    user.credentials = await this._userCredentialsCreateService.createUserCredentials();
    user.credentials.passwordSalt = salt;
    user.credentials.passwordHash = await this._cryptoService.generateHash(input.password, salt);
    // user.userInfo = this._userInfoCreateService.createUserInfoFromInput(input);

    const result = await this.commandBus.execute(new TestCommand('Oleh', 'Kovalov'));

    console.log('Result: ', result);

    // this.eventEmitter.emitAsync(
    //   'order.created',
    //   {
    //     orderId: 1,
    //     payload: {},
    //   },
    // );

    console.log('emited');
    const userNew = await this._userSaveService.save(user);
    console.log('user:', userNew);
    return userNew;
  }

  async updateUser(input: UpdateUserInput): Promise<UserEntity> {
    const {
      id,
      status,
      firstName,
      lastName,
      email,
      role,
      licenseType,
    } = input;
    const user = await this._userLoadService.loadById(id);

    user.email = email ?? user.email;
    user.userInfo.firstName = firstName ?? user.userInfo.firstName;
    user.userInfo.lastName = lastName ?? user.userInfo.lastName;
    user.userInfo.role = role ?? user.userInfo.role;
    user.userInfo.licenseType = licenseType ?? user.userInfo.licenseType;
    user.status = status ?? user.status;

    return await this._userSaveService.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this._userDeleteService.deleteById(id);
  }

  // async updateResetPasswordData(userId: number, token: string, password: string = null): Promise<void> {
  //   const updateData: Partial<UserEntity> = {};
  //
  //   // updateData.resetPasswordToken = token;
  //   // if (token) {
  //   //   const expTimestamp = Date.now() + 60 * 1000 * 60;
  //   //   updateData.resetPasswordExpirationDate = new Date(expTimestamp);
  //   // } else {
  //   //   updateData.resetPasswordExpirationDate = null;
  //   // }
  //
  //   if (password) {
  //     const salt = await this._cryptoService.generateSalt();
  //     const passwordHash = await this._cryptoService.generateHash(password, salt);
  //     // updateData.passwordSalt = salt;
  //     // updateData.passwordHash = passwordHash;
  //   }
  //   await this.usersRepository.update({id: userId}, updateData);
  // }

  // async getUserByResetToken(token: string): Promise<UserEntity> {
  //   return this.usersRepository.findOne({resetPasswordToken: token});
  // }

  async getUser(id: number): Promise<UserEntity> {
    return this._userLoadService.loadById(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this._userLoadService.loadByEmail(email);
  }

  private static _composeSearchConditions(input: Partial<GetUsersInput>): FindOptionsWhere<UserEntity> {
    const {role, licenseType, firstName, lastName, status} = input;
    const conditions: FindOptionsWhere<UserEntity> = {};

    conditions.userInfo = {};

    if (role) {
      conditions.userInfo.role = Raw((alias) => `${alias} && ARRAY[:...role]::user_info_role_enum[]`,
        {
          role,
        },
      );
    }

    if (licenseType) {
      conditions.userInfo.licenseType = Raw((alias) => `${alias} IN(:...licenseType)`,
        {
          licenseType,
        },
      );
    }

    if (
      firstName
      && firstName.length > 2
    ) {
      conditions.userInfo.firstName = Like(`%${firstName}%`);
    }

    if (lastName
      && lastName.length > 2
    ) {
      conditions.userInfo.lastName = Like(`%${lastName}%`);
    }

    if (status) {
      conditions.status = Raw((alias) => `${alias} IN(:...status)`,
        {
          status,
        });
    }

    return conditions;
  }
}
