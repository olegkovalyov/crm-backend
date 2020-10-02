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
    return this.eventModel.find().populate('loads');
  }

  async createEvent(createData: CreateEventInput): Promise<IEvent> {
    const {
      title,
      date,
      notes,
    } = createData;
    return this.eventModel.create({
      id: uuid(),
      title,
      date,
      notes: notes ? notes : null,
    });
  }

  async updateEvent(updateData: UpdateEventInput): Promise<IEvent> {
    const {
      id,
      title,
      date,
      notes,
    } = updateData;

    const currentEvent = await this.eventModel.findOne({ id: updateData.id });

    if (!currentEvent) {
      throw new BadRequestException(`Event with id: ${id} doesnt exists`);
    }


    if (title) {
      currentEvent.title = title;
    }

    if (date) {
      currentEvent.date = date;
    }

    if (notes) {
      currentEvent.notes = notes;
    }

    return currentEvent.save();
  }

  async removeEventById(id: string) {
    return this.eventModel.findOneAndDelete({ id: id }).exec();
  }

}
