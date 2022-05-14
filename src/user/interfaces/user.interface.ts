import {registerEnumType} from '@nestjs/graphql';
import {FindOperator} from 'typeorm';
import {UserEntity} from '../../database/user/entities/user.entity';
import {UserModel} from '../models/user.model';
import {ClientEntity} from '../../database/client/entities/client.entity';
import {ClientModel} from '../../client/models/client.model';

export interface GraphQlServiceInterface {
  constructUserModel(user: UserEntity): UserModel;

  constructClientModel(client: ClientEntity): ClientModel;
}

export interface UserAccessTokenPayloadInterface {
  id: string,
  status: string,
  firstName: string,
  lastName: string,
  email: string,
  role: UserRole[],
  iat: number,
  exp: number,
}

export enum UserRole {
  STUDENT = 'STUDENT',
  SKYDIVER = 'SKYDIVER',
  COACH = 'COACH',
  CAMERAMAN = 'CAMERAMAN',
  TM = 'TM',
  PACKER = 'PACKER',
  RIGGER = 'RIGGER',
  MANIFEST = 'MANIFEST',
  ADMIN = 'ADMIN',
}

export enum LicenseType {
  NONE = 'NONE',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(LicenseType, {
  name: 'LicenseType',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});
