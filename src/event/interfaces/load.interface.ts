import { registerEnumType } from '@nestjs/graphql';

export enum LoadStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(LoadStatus, {
  name: 'LoadStatus',
});
