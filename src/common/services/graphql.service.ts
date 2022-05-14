import {Injectable, Scope} from '@nestjs/common';
import {UserModel} from '../../user/models/user.model';
import {UserEntity} from '../../database/user/entities/user.entity';
import {ClientEntity} from '../../database/client/entities/client.entity';
import {ClientModel} from '../../client/models/client.model';
import {LicenseType, UserRole} from '../../user/interfaces/user.interface';

@Injectable({scope: Scope.REQUEST})
export class GraphqlService {

  constructUserModel(user: UserEntity): UserModel {
    return {
      id: user.id,
      personId: user.personId,
      status: user.status,
      firstName: '',
      lastName: '',
      email: user.email,
      role: [UserRole.COACH],
      licenseType: LicenseType.A,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  constructClientModel(client: ClientEntity): ClientModel {
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
