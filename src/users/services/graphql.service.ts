import {Injectable, Scope} from '@nestjs/common';
import {UserModel} from '../models/user.model';
import {User} from '../entities/user.entity';
import {Client} from '../entities/client.entity';
import {ClientModel} from '../models/client.model';

@Injectable({scope: Scope.REQUEST})
export class GraphqlService {

  constructUserModel(user: User): UserModel {
    return {
      id: user.id,
      personId: user.personId,
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

  constructClientModel(client: Client): ClientModel {
    return {
      id: client.id,
      personId: client.personId,
      status: client.status,
      paymentStatus: client.paymentStatus,
      firstName: client.firstName,
      lastName: client.lastName,
      gender: client.gender,
      weight: client.weight,
      certificate: client.certificate,
      phone: client.phone,
      dateOfBirth: client.dateOfBirth,
      email: client.email,
      role: client.role,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      processedAt: client.processedAt,
    };
  }
}
