import {Injectable, Scope} from '@nestjs/common';
import {UserModel} from '../models/user.model';
import {User} from '../entities/user.entity';

@Injectable({scope: Scope.REQUEST})
export class GraphqlService {

  constructUserModel(user: User): UserModel {
    return {
      id: user.id,
      status: user.status,
      firstName: user.userInfo.firstName,
      lastName: user.userInfo.lastName,
      email: user.email,
      role: user.userInfo.role,
      licenseType: user.userInfo.licenseType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
