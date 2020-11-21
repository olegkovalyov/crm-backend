import { registerEnumType } from '@nestjs/graphql';


export interface MemberAccessTokenPayloadInterface {
  id: string,
  status: string,
  firstName: string,
  lastName: string,
  email: string,
  roles: MemberRole[],
  iat: number,
  exp: number,
}

export enum MemberRole {
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

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

registerEnumType(MemberStatus, {
  name: 'MemberStatus',
});

registerEnumType(LicenseType, {
  name: 'LicenseType',
});

registerEnumType(MemberRole, {
  name: 'MemberRole',
});
