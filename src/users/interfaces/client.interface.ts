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
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
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

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
  REFUNDED = 'REFUNDED',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
