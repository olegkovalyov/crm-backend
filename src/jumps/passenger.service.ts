import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/user.interface';
import { IPassenger, IPassengerNestedObjectIds } from './interfaces/passenger.interface';
import { CreatePassengerInput } from './inputs/create-passenger.input';
import { v4 as uuid } from 'uuid';
import { UpdatePassengerInput } from './inputs/update-passenger.input';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Passenger') private passengerModel: Model<IPassenger>,
  ) {
  }

  async getPassengers(): Promise<IPassenger[]> {
    return this.passengerModel.find().populate('instructor operator');
  }

  async createPassenger(createData: CreatePassengerInput): Promise<IPassenger> {
    const {
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      handCamera,
      numberOfLoad,
      jumpDate,
      notes,
    } = createData;

    const { instructor, operator } = await this.getPassengersNestedObjectIds(createData);

    return this.passengerModel.create({
      id: uuid(),
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      handCamera,
      instructor,
      operator,
      numberOfLoad: numberOfLoad ? numberOfLoad : null,
      jumpDate: jumpDate ? jumpDate : null,
      notes: notes ? notes : null,
    });
  }

  async updatePassenger(updateData: UpdatePassengerInput): Promise<IPassenger> {
    const {
      id,
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      numberOfLoad,
      jumpDate,
      notes,
    } = updateData;

    const currentPassenger = await this.passengerModel.findOne({ id: updateData.id });

    if (!currentPassenger) {
      throw new BadRequestException(`Passenger with id: ${id} doesnt exists`);
    }

    if (status) {
      currentPassenger.status = status;
    }

    if (firstName) {
      currentPassenger.firstName = firstName;
    }

    if (lastName) {
      currentPassenger.lastName = lastName;
    }

    if (gender) {
      currentPassenger.gender = gender;
    }

    if (weight) {
      currentPassenger.weight = weight;
    }

    if (phone) {
      currentPassenger.phone = phone;
    }

    const { instructor, operator } = await this.getPassengersNestedObjectIds(updateData);

    if (updateData.instructorId !== undefined) {
      currentPassenger.instructor = instructor;
    }

    if (updateData.operatorId !== undefined) {
      currentPassenger.operator = operator;
    }

    if (numberOfLoad) {
      currentPassenger.numberOfLoad = numberOfLoad;
    }

    if (jumpDate) {
      currentPassenger.jumpDate = jumpDate;
    }

    if (notes) {
      currentPassenger.notes = notes;
    }

    return currentPassenger.save();
  }

  async removePassengerById(id: string) {
    return this.passengerModel.findOneAndDelete({ id: id }).exec();
  }

  private async getPassengersNestedObjectIds(
    passenger: CreatePassengerInput | UpdatePassengerInput,
  ): Promise<IPassengerNestedObjectIds> {
    let instructor = null;
    if (passenger.operatorId) {
      instructor = await this.userModel.findOne({ id: passenger.instructorId });
    }

    let operator = null;
    if (passenger.operatorId) {
      operator = await this.userModel.findOne({ id: passenger.operatorId });
    }
    return {
      instructor,
      operator,
    };
  }
}
