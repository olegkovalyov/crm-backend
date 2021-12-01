import {Injectable, Scope} from '@nestjs/common';
import {Event} from '../entities/event.entity';
import {EventModel} from '../models/event.model';

@Injectable({scope: Scope.REQUEST})
export class GraphqlService {

  constructEventModel(event: Event): EventModel {
    return {
      id: event.id,
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      info: event.info,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}
