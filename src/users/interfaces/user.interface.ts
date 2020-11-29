import { registerEnumType } from '@nestjs/graphql';
import { MemberRole } from './member.interface';
import { ClientRole } from './client.interface';

export enum UserType {
  MEMBER = 'Member',
  CLIENT = 'Client'
}

registerEnumType(UserType, {
  name: 'UserType',
});

export const UserRole = Object.assign({}, MemberRole, ClientRole);

registerEnumType(UserRole, {
  name: 'UserRole',
});
