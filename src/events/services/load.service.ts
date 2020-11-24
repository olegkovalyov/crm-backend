import { Injectable } from '@nestjs/common';

@Injectable()
export class LoadService {
  constructor(
    // @InjectModel('Event') private eventModel: Model<EventInterface>,
  ) {
  }

  // async getLoads(eventId: string): Promise<ILoad[]> {
  //   const event = await this.eventModel.findOne({ id: eventId }).exec();
  //   if (!event) {
  //     throw new BadRequestException('Event not found');
  //   }
  //
  //   return this.loadModel
  //     .find({ event: event._id })
  //     .populate('event')
  //     .populate('members')
  //     .populate('clients');
  // }
  //
  // async createLoad(createData: CreateLoadInput): Promise<ILoad> {
  //   const {
  //     eventId,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     memberIds,
  //     clientIds,
  //     notes,
  //   } = createData;
  //
  //   const event = await this.eventModel.findOne({ id: eventId });
  //   const members = await this.memberModel.find({ id: { $in: memberIds } }).exec();
  //   const clients = await this.clientModel.find({ id: { $in: clientIds } }).exec();
  //
  //   if (!event) {
  //     throw new BadRequestException(`Event with id: ${eventId} doesnt exists`);
  //   }
  //
  //   const load = await this.loadModel.create({
  //     id: uuid(),
  //     event,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     members,
  //     clients,
  //     notes: notes ? notes : null,
  //   });
  //
  //   event.loads.push(load);
  //   event.save();
  //   return load;
  // }
  //
  //
  // async updateLoad(updateData: UpdateLoadInput): Promise<ILoad> {
  //   const {
  //     id,
  //     status,
  //     date,
  //     loadNumber,
  //     aircraft,
  //     notes,
  //   } = updateData;
  //
  //   const currentLoad = await this.loadModel.findOne({ id: updateData.id });
  //
  //   if (!currentLoad) {
  //     throw new BadRequestException(`Load with id: ${id} doesnt exists`);
  //   }
  //
  //
  //   if (status) {
  //     currentLoad.status = status;
  //   }
  //
  //   if (loadNumber) {
  //     currentLoad.loadNumber = loadNumber;
  //   }
  //
  //   if (date) {
  //     currentLoad.date = date;
  //   }
  //
  //   if (aircraft) {
  //     currentLoad.aircraft = aircraft;
  //   }
  //
  //   if (notes) {
  //     currentLoad.notes = notes;
  //   }
  //
  //   return currentLoad.save();
  // }
  //
  // async removeLoadById(id: string) {
  //   return this.loadModel.findOneAndDelete({ id: id }).exec();
  // }

}
