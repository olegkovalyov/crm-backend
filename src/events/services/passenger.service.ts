import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';
import { IPassenger } from '../interfaces/passenger.interface';
import { CreatePassengerInput } from '../inputs/create-passenger.input';
import { v4 as uuid } from 'uuid';
import { UpdatePassengerInput } from '../inputs/update-passenger.input';

@Injectable()
export class PassengerService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Passenger') private passengerModel: Model<IPassenger>,
  ) {
  }

  async getPassengers(): Promise<IPassenger[]> {
    return this.passengerModel.find().populate('tm').populate('cameraman');
  }

  async createPassenger(createData: CreatePassengerInput): Promise<IPassenger> {
    const {
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      withHandCameraVideo,
      withCameraman,
      tmId,
      cameramanId,
      date,
      notes,
    } = createData;

    let tm: IUser | null = null;
    let cameraman: IUser | null = null;

    if (tmId) {
      tm = await this.userModel.findOne({ id: tmId }).exec();
    }

    if (cameramanId) {
      cameraman = await this.userModel.findOne({ id: cameramanId }).exec();
    }

    return this.passengerModel.create({
      id: uuid(),
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      withHandCameraVideo,
      withCameraman,
      tm,
      cameraman,
      date: date ?? null,
      notes: notes ?? null,
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
      withHandCameraVideo,
      withCameraman,
      tmId,
      cameramanId,
      date,
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

    if (withHandCameraVideo) {
      currentPassenger.withHandCameraVideo = withHandCameraVideo;
    }

    if (withCameraman) {
      currentPassenger.withCameraman = withCameraman;
    }

    let tm, cameraman: IUser | null;

    if (tmId) {
      tm = await this.userModel.findOne({ id: tmId }).exec();
      currentPassenger.tm = tm;
    }

    if (cameramanId) {
      cameraman = await this.userModel.findOne({ id: cameramanId }).exec();
      currentPassenger.cameraman = cameraman;
    }


    if (date) {
      currentPassenger.date = date;
    }

    if (notes) {
      currentPassenger.notes = notes;
    }

    return currentPassenger.save();
  }

  async removePassengerById(id: string) {
    return this.passengerModel.findOneAndDelete({ id: id }).exec();
  }

}
