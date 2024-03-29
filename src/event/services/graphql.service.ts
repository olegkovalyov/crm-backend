import {Injectable, Scope} from '@nestjs/common';
import {Event} from '../entities/event.entity';
import {EventModel} from '../models/event.model';
import {Load} from '../entities/load.entity';
import {LoadModel} from '../models/load.model';
import {Slot} from '../entities/slot.entity';
import {SlotModel} from '../models/slot.model';

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

  constructLoadModel(load: Load): LoadModel {
    return {
      id: load.id,
      status: load.status,
      capacity: load.capacity,
      order: load.order,
      takeOffTime: load.takeOffTime,
      landingTime: load.landingTime,
      slots: [],
      info: load.info,
      createdAt: load.createdAt,
      updatedAt: load.updatedAt,
    };
  }

  constructSlotModel(slot: Slot): SlotModel {
    return {
      id: slot.id,
      type: slot.type,
      personIds: slot.personIds,
      info: slot.info,
    };
  }
}
