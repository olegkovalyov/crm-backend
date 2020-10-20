import { Document } from 'mongoose';
import { registerEnumType } from '@nestjs/graphql';

export interface IUser extends Document {
  id: string,
  status: string,
  firstName: string,
  lastName: string,
  email: string,
  passwordSalt: string,
  passwordHash: string,
  resetPasswordToken: string | null,
  resetPasswordExpirationDate: Date | null,
  refreshToken: string | null,
  refreshTokenExpirationDate: Date | null,
  roles: string[],
  createdAt: Date,
  updatedAt: Date,
  licenseType?: LicenseType,
}

export interface IUserAccessTokenPayload {
  id: string,
  status: string,
  firstName: string,
  lastName: string,
  email: string,
  roles: UserRole[],
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
