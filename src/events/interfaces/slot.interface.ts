import {registerEnumType} from '@nestjs/graphql';

export enum SlotType {
  SPORT = 'SPORT',
  TM_WITH_CAMERAMAN = 'TM_WITH_CAMERAMAN',
  TM_WITHOUT_CAMERAMAN = 'TM_WITHOUT_CAMERAMAN',
  STATIC_LINE = 'STATIC_LINE',
  AFF = 'AFF',
  COACH = 'COACH',
  HOP_ON_HOP_OFF = 'HOP_ON_HOP_OFF',
  PASSENGER = 'PASSENGER'
}

registerEnumType(SlotType, {
  name: 'SlotType',
});
