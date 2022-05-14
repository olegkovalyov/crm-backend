import {registerEnumType} from '@nestjs/graphql';
import {FindOperator} from 'typeorm';

export interface GetClientsFilterConditionInterface {
  status?: FindOperator<any>;
  role?: FindOperator<any>;
  paymentStatus?: FindOperator<any>;
  gender?: FindOperator<any>;
  dateOfBirth?: FindOperator<any>;
  firstName?: FindOperator<any>;
  lastName?: FindOperator<any>;
  email?: FindOperator<any>;
  certificate?: FindOperator<any>;
  createdAt?: FindOperator<any>;
  processedAt?: FindOperator<any>;
}

export enum ClientRole {
  PASSENGER = 'PASSENGER',
  TANDEM = 'TANDEM',
  STATIC_LINE = 'STATIC_LINE',
}

registerEnumType(ClientRole, {
  name: 'ClientRole',
});

export enum ClientStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  ARCHIVED = 'ARCHIVED'
}

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
  REFUNDED = 'REFUNDED'
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

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
