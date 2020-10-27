import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberInterface } from '../../members/interfaces/member.interface';
import { ClientInterface } from '../interfaces/client.interface';
import { CreateClientInput } from '../inputs/create-client.input';
import { v4 as uuid } from 'uuid';
import { UpdateClientInput } from '../inputs/update-client.input';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel('Member') private memberModel: Model<MemberInterface>,
    @InjectModel('Client') private clientModel: Model<ClientInterface>,
  ) {
  }

  async getClients(): Promise<ClientInterface[]> {
    return this.clientModel.find().populate('tm').populate('cameraman');
  }

  async createClient(createData: CreateClientInput): Promise<ClientInterface> {
    const {
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      withHandCameraVideo,
      withCameraman,
      onlyFlight,
      paid,
      tmId,
      cameramanId,
      date,
      notes,
    } = createData;

    let tm: MemberInterface | null = null;
    let cameraman: MemberInterface | null = null;

    if (tmId) {
      tm = await this.memberModel.findOne({ id: tmId }).exec();
    }

    if (cameramanId) {
      cameraman = await this.memberModel.findOne({ id: cameramanId }).exec();
    }

    return this.clientModel.create({
      id: uuid(),
      status,
      firstName,
      lastName,
      gender,
      weight,
      phone,
      withHandCameraVideo,
      withCameraman,
      onlyFlight,
      paid,
      tm,
      cameraman,
      date: date ?? null,
      notes: notes ?? null,
    });
  }

  async updateClient(updateData: UpdateClientInput): Promise<ClientInterface> {
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
      onlyFlight,
      paid,
      tmId,
      cameramanId,
      date,
      notes,
    } = updateData;

    const client = await this.clientModel.findOne({ id: updateData.id });

    if (!client) {
      throw new BadRequestException(`Passenger with id: ${id} doesnt exists`);
    }

    if (status) {
      client.status = status;
    }

    if (firstName) {
      client.firstName = firstName;
    }

    if (lastName) {
      client.lastName = lastName;
    }

    if (gender) {
      client.gender = gender;
    }

    if (weight) {
      client.weight = weight;
    }

    if (phone) {
      client.phone = phone;
    }

    if (withHandCameraVideo) {
      client.withHandCameraVideo = withHandCameraVideo;
    }

    if (withCameraman) {
      client.withCameraman = withCameraman;
    }

    if (onlyFlight) {
      client.onlyFlight = onlyFlight;
    }

    if (paid) {
      client.paid = paid;
    }

    let tm, cameraman: MemberInterface | null;

    if (tmId) {
      tm = await this.memberModel.findOne({ id: tmId }).exec();
      client.tm = tm;
    }

    if (cameramanId) {
      cameraman = await this.memberModel.findOne({ id: cameramanId }).exec();
      client.cameraman = cameraman;
    }


    if (date) {
      client.date = date;
    }

    if (notes) {
      client.notes = notes;
    }

    return client.save();
  }

  async deleteClientById(id: string) {
    return this.clientModel.findOneAndDelete({ id: id }).exec();
  }

  async getClientById(id: string): Promise<ClientInterface> {
    return this.clientModel
      .findOne({ id: id })
      .populate('tm')
      .populate('cameraman')
      .exec();
  }
}
