import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Load} from '../entities/load.entity';
import {CreateLoadInput} from '../inputs/loads/create-load.input';
import {LoadModel} from '../models/load.model';
import {UpdateLoadInput} from '../inputs/loads/update-load.input';
import {SlotService} from './slot.service';

@Injectable()
export class LoadService {

  constructor(
    @InjectRepository(Load)
    private readonly loadRepository: Repository<Load>,
    @Inject(forwardRef(() => SlotService))
    private readonly slotService: SlotService,
  ) {
  }

  async getLoads(eventId: number): Promise<Load[]> {
    const data = await this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.slots', 'slots')
      .where('load.eventId = :eventId', {eventId: eventId})
      .orderBy('load.order', 'ASC')
      .getMany();
    return data;
  }

  async getLoadById(id: number): Promise<Load> {
    const load = await this.loadRepository
      .createQueryBuilder('load')
      .leftJoinAndSelect('load.slots', 'slots')
      .where('load.id = :id', {id: id})
      .getOne();
    return load;
  }

  async createLoad(createData: CreateLoadInput): Promise<Load> {
    const {
      eventId,
      capacity,
      status,
      order,
      time,
      notes,
    } = createData;

    const load = new Load();
    load.status = status;
    load.time = time;
    load.capacity = capacity;
    load.slots = [];
    load.notes = notes;
    if (order) {
      load.order = order;
    } else {
      load.order = (await this.getLoads(eventId)).length;
    }
    return await this.loadRepository.save(load);
  }

  async updateLoad(updateData: UpdateLoadInput): Promise<Load> {
    const {
      id,
      capacity,
      status,
      order,
      time,
      notes,
    } = updateData;

    const currentLoad = await this.getLoadById(id);

    if (!currentLoad) {
      throw new BadRequestException(`Load with id: ${id} doesnt exists`);
    }

    if (status) {
      currentLoad.status = status;
    }

    if (order !== undefined
      && order !== null
    ) {
      currentLoad.order = order;
    }

    if (time) {
      currentLoad.time = time;
    }

    if (capacity) {
      currentLoad.capacity = capacity;
    }

    if (notes) {
      currentLoad.notes = notes;
    }

    return this.loadRepository.save(currentLoad);
  }

  async deleteLoadById(id: number): Promise<Load> {
    const load = await this.getLoadById(id);
    if (!load) {
      throw new BadRequestException(`Load with id: ${id} doesn't exists`);
    }

    const deleteResult = await this.loadRepository
      .createQueryBuilder('load')
      .delete()
      .from(Load)
      .where('id = :id', {id: id})
      .execute();

    await this.reorderLoads(load.event.id);

    if (deleteResult.affected !== 1) {
      throw new BadRequestException(`Failed to delete event with id: ${id}`);
    }
    return load;
  }

  async reorderLoads(eventId: number) {
    const loads = await this.getLoads(eventId);
    let i = 0;
    for (const currentLoad of loads) {
      currentLoad.order = i;
      i++;
      await this.loadRepository.save(currentLoad);
    }
  }

  async transformToGraphQlLoadModel(loadEntity: Load): Promise<LoadModel> {
    const slots = [];
    loadEntity.slots.forEach((slot) => {
      slots.push(this.slotService.transformToGraphQlSlotModel(slot));
    });
    return {
      id: loadEntity.id,
      slots: slots,
      order: loadEntity.order,
      status: loadEntity.status,
      time: loadEntity.time,
      capacity: loadEntity.capacity,
      notes: loadEntity.notes,
    };
  }

}
