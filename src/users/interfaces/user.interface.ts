import { registerEnumType } from '@nestjs/graphql';

export enum UserType {
  MEMBER = 'Member',
  CLIENT = 'Client'
}

registerEnumType(UserType, {
  name: 'UserType',
});
