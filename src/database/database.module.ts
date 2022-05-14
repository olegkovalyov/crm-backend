import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './user/entities/user.entity';
import {UserInfoEntity} from './user/entities/user-info.entity';
import {ClientEntity} from './client/entities/client.entity';
import {RefreshTokenEntity} from './auth/entities/refresh-token.entity';
import {UserLoadService} from './user/services/load/user.load.service';
import {UserSaveService} from './user/services/save/user.save.service';
import {UserCreateService} from './user/services/create/user.create.service';
import {UserInfoCreateService} from './user/services/create/user-info.create.service';
import {UserDeleteService} from './user/services/delete/user.delete.service';
import {initTypeOrmOptions} from './config/type-orm.config';
import {ResetPasswordEntity} from './auth/entities/reset-password.entity';
import {RefreshTokenCreateService} from './auth/services/create/refresh-token.create.service';
import {RefreshTokenSaveService} from './auth/services/save/refresh-token.save.service';
import {UserCredentialsEntity} from './user/entities/user-credentials.entity';
import {UserCredentialsCreateService} from './user/services/create/user-credentials.create.service';
import {UserCredentialsLoadService} from './user/services/load/user-credentials.load.service';
import {UserCredentialsSaveService} from './user/services/save/user-credentials.save.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(initTypeOrmOptions()),
    TypeOrmModule.forFeature([
      RefreshTokenEntity,
      ResetPasswordEntity,
      UserEntity,
      UserInfoEntity,
      UserCredentialsEntity,
      ClientEntity,
    ]),
  ],
  providers: [
    UserLoadService,
    UserCreateService,
    UserSaveService,
    UserDeleteService,
    UserInfoCreateService,
    UserCredentialsLoadService,
    UserCredentialsCreateService,
    UserCredentialsSaveService,
    RefreshTokenCreateService,
    RefreshTokenSaveService,
  ],
  exports: [
    TypeOrmModule,
    UserLoadService,
    UserCreateService,
    UserSaveService,
    UserDeleteService,
    UserInfoCreateService,
    UserCredentialsLoadService,
    UserCredentialsCreateService,
    UserCredentialsSaveService,
    RefreshTokenCreateService,
    RefreshTokenSaveService,
  ],
})
export class DatabaseModule {
}
