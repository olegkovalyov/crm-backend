import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {SlotService} from './slot.service';
import {LoadService} from './load.service';
import {Connection} from 'typeorm';

@Injectable()
export class SlotValidatorService {

  constructor(
    private connection: Connection,
    @Inject(forwardRef(() => SlotService))
    private readonly slotService: SlotService,
    @Inject(forwardRef(() => LoadService))
    private readonly loadService: LoadService,
  ) {
  }

  async personExistInLoad(personId: string, loadId: number): Promise<boolean> {
    const slots = await this.slotService.getSlots(loadId);
    let exist = false;
    slots.forEach(slot => {
      if (slot.personIds.includes(personId)) {
        exist = true;
      }
    });
    return exist;
  }

  async validateTotalLoadCapacity(slotCount: number, loadId: number): Promise<boolean> {
    let isValid = true;
    const load = await this.loadService.getLoadById(loadId);
    const slots = await this.slotService.getSlots(loadId);
    let countOfRegisteredPersonsInLoad = 0;
    slots.forEach(slot => {
      countOfRegisteredPersonsInLoad += slot.personIds.length;
    });
    if (countOfRegisteredPersonsInLoad + slotCount > load.capacity) {
      isValid = false;
    }
    return isValid;
  }

  async personExist(personId: string): Promise<boolean> {
    let personExist = false;
    const queryRunner = this.connection.createQueryRunner();
    const result = (await queryRunner.manager.query(
      `SELECT "id"
       FROM crm.public.client
       WHERE "personId" = $1
       UNION
       SELECT "id"
       FROM crm.public.user
       WHERE "personId" = $1`, [personId])) as Array<unknown>;
    if (result.length) {
      personExist = true;
    }
    return personExist;
  }
}
