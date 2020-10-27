import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberInterface } from '../../members/interfaces/member.interface';
import { ClientInterface } from '../interfaces/client.interface';
import { v4 as uuid } from 'uuid';
import { EventInterface } from '../interfaces/event.interface';
import { CreateEventInput } from '../inputs/create-event.input';
import { UpdateEventInput } from '../inputs/update-event.input';

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Member') private memberModel: Model<MemberInterface>,
    @InjectModel('Client') private clientModel: Model<ClientInterface>,
    @InjectModel('Event') private eventModel: Model<EventInterface>,
  ) {
  }

  async getEvents(): Promise<EventInterface[]> {
    return this.eventModel
      .find()
      .sort({ date: -1 })
      .populate('loads')
      .populate('staff');
  }

  async createEvent(createData: CreateEventInput): Promise<EventInterface> {
    const {
      name,
      date,
      notes,
      staffIds,
    } = createData;

    const staff = await this.memberModel.find({ id: { $in: staffIds } }).exec();

    return this.eventModel.create({
      id: uuid(),
      name,
      date,
      notes,
      staff,
    });
  }

  async updateEvent(updateData: UpdateEventInput): Promise<EventInterface> {
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

    currentEvent.staff = await this.memberModel.find({ id: { $in: staffIds } }).exec();

    if (notes) {
      currentEvent.notes = notes;
    }

    return currentEvent.save();
  }

  async removeEventById(id: string) {
    return this.eventModel.findOneAndDelete({ id: id }).exec();
  }

  async getEventById(id: string): Promise<EventInterface> {
    return this.eventModel.findOne({ id: id }).populate('staff').exec();
  }
}
