import {registerEnumType} from '@nestjs/graphql';

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
