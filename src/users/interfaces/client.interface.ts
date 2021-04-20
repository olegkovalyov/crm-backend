import { registerEnumType } from '@nestjs/graphql';

export enum ClientRole {
  AS_A_PASSENGER = 'AS_A_PASSENGER',
  TANDEM = 'TANDEM',
  STATIC_LINE = 'STATIC_LINE',
}

registerEnumType(ClientRole, {
  name: 'ClientRole',
});

export enum ClientStatus {
  PENDING = 'ACTIVE',
  PROCESSED = 'PROCESSED',
}

registerEnumType(ClientStatus, {
  name: 'ClientStatus',
});

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

registerEnumType(Gender, {
  name: 'Gender',
});
