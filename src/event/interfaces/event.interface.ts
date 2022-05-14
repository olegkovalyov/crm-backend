import {FindOperator} from 'typeorm';

export interface GetEventsConditionInterface {
  name?: FindOperator<any>;
  startDate?: FindOperator<any>;
  endDate?: FindOperator<any>;
}