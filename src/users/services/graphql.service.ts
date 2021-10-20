import {Injectable, Scope} from '@nestjs/common';
import {UserModel} from '../models/user.model';
import {User} from '../entities/user.entity';
import {UserInfo} from '../entities/user-info.entity';

@Injectable({scope: Scope.REQUEST})
export class GraphqlService {

  constructUserModel(user: User, userInfo: UserInfo): UserModel {
    return {
      id: user.id,
      status: user.status,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: user.email,
      roles: userInfo.roles,
      licenseType: userInfo.licenseType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
