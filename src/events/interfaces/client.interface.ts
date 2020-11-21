import { Document } from 'mongoose';
import { registerEnumType } from '@nestjs/graphql';
import { MemberModel } from '../../users/models/member.model';

export interface ClientInterface extends Document {
  id: string,
  type: ClientType,
  status: ClientStatus,
  gender: Gender;
  age: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number;
  phone: string;
  address: string;
  withHandCameraVideo: boolean;
  withCameraman: boolean;
  tm: MemberModel;
  cameraman: MemberModel;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  processedAt: Date | null;
  notes: string | null;
  certificate: string | null;
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  REFUSED = 'REFUSED'
}

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
  REFUNDED = 'REFUNDED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ClientType {
  AS_A_PASSENGER = 'AS_A_PASSENGER',
  TANDEM = 'TANDEM',
  STATIC_LINE = 'STATIC_LINE',
}

registerEnumType(ClientStatus, {
  name: 'ClientStatus',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

registerEnumType(Gender, {
  name: 'Gender',
});

registerEnumType(ClientType, {
  name: 'ClientType',
});
