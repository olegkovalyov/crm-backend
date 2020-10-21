import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';
import { IPassenger } from '../interfaces/passenger.interface';
import { v4 as uuid } from 'uuid';
import { IEvent } from '../interfaces/event.interface';
import { CreateEventInput } from '../inputs/create-event.input';
import { UpdateEventInput } from '../inputs/update-event.input';

@Injectable()
export class EventService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Passenger') private passengerModel: Model<IPassenger>,
    @InjectModel('Event') private eventModel: Model<IEvent>,
  ) {
  }

  async getEvents(): Promise<IEvent[]> {
    return this.eventModel
      .find()
      .sort({ date: -1 })
      .populate('loads')
      .populate('staff');
  }

  async createEvent(createData: CreateEventInput): Promise<IEvent> {
    const {
      name,
      date,
      notes,
      staffIds,
    } = createData;

    const staff = await this.userModel.find({ id: { $in: staffIds } }).exec();

    return this.eventModel.create({
      id: uuid(),
      name,
      date,
      notes,
      staff,
    });
  }

  async updateEvent(updateData: UpdateEventInput): Promise<IEvent> {
    const {
      id,
      name,
      date,
      notes,
      staffIds,
    } = updateData;

    const currentEvent = await this.eventModel.findOne({ id: updateData.id });

    if (!currentEvent) {
      throw new BadRequestException(`Event with id: ${id} doesnt exists`);
    }


    if (name) {
      currentEvent.name = name;
    }

    if (date) {
      currentEvent.date = date;
    }

    currentEvent.staff = await this.userModel.find({ id: { $in: staffIds } }).exec();

    if (notes) {
      currentEvent.notes = notes;
    }

    return currentEvent.save();
  }

  async removeEventById(id: string) {
    return this.eventModel.findOneAndDelete({ id: id }).exec();
  }

  async getEventById(id: string): Promise<IEvent> {
    return this.eventModel.findOne({ id: id }).populate('staff').exec();
  }

}
