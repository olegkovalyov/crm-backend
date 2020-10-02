import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';
import { IPassenger } from '../interfaces/passenger.interface';
import { v4 as uuid } from 'uuid';
import { IEvent } from '../interfaces/event.interface';
import { ILoad } from '../interfaces/load.interface';
import { CreateLoadInput } from '../inputs/create-load.input';
import { UpdateLoadInput } from '../inputs/update-load.input';

@Injectable()
export class LoadService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Passenger') private passengerModel: Model<IPassenger>,
    @InjectModel('Event') private eventModel: Model<IEvent>,
    @InjectModel('Load') private loadModel: Model<ILoad>,
  ) {
  }

  async getLoads(): Promise<ILoad[]> {
    return this.loadModel.find().populate('event');
  }

  async createLoad(createData: CreateLoadInput): Promise<ILoad> {
    const {
      eventId,
      status,
      date,
      loadNumber,
      aircraft,
      notes,
    } = createData;

    const event = await this.eventModel.findOne({ id: eventId });

    if (!event) {
      throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
    }

    const load = await this.loadModel.create({
      id: uuid(),
      event,
      status,
      date,
      loadNumber,
      aircraft,
      notes: notes ? notes : null,
    });

    event.loads.push(load);
    event.save();
    return load;
  }


  async updateLoad(updateData: UpdateLoadInput): Promise<ILoad> {
    const {
      id,
      status,
      date,
      loadNumber,
      aircraft,
      notes,
    } = updateData;

    const currentLoad = await this.loadModel.findOne({ id: updateData.id });

    if (!currentLoad) {
      throw new BadRequestException(`Load with id: ${id} doesnt exists`);
    }


    if (status) {
      currentLoad.status = status;
    }

    if (loadNumber) {
      currentLoad.loadNumber = loadNumber;
    }

    if (date) {
      currentLoad.date = date;
    }

    if (aircraft) {
      currentLoad.aircraft = aircraft;
    }

    if (notes) {
      currentLoad.notes = notes;
    }

    return currentLoad.save();
  }

  async removeLoadById(id: string) {
    return this.loadModel.findOneAndDelete({ id: id }).exec();
  }

}
