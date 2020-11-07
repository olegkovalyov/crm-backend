import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberInterface } from '../../members/interfaces/member.interface';
import { ClientInterface, ClientType } from '../interfaces/client.interface';
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
      type,
      status,
      gender,
      age,
      firstName,
      lastName,
      email,
      weight,
      phone,
      address,
      withHandCameraVideo,
      withCameraman,
      paymentStatus,
      tmId,
      cameramanId,
      date,
      notes,
      certificate,
    } = createData;

    let tm: MemberInterface | null = null;
    let cameraman: MemberInterface | null = null;

    if (type === ClientType.TANDEM) {
      if (tmId) {
        tm = await this.memberModel.findOne({ id: tmId }).exec();
      }
      if (cameramanId) {
        cameraman = await this.memberModel.findOne({ id: cameramanId }).exec();
      }
    }

    return this.clientModel.create({
      id: uuid(),
      type,
      status,
      gender,
      age,
      firstName,
      lastName,
      email: email ?? null,
      weight,
      phone,
      address,
      withHandCameraVideo,
      withCameraman,
      paymentStatus,
      tm,
      cameraman,
      date: date ?? null,
      notes: notes ?? null,
      certificate: certificate ?? null,
    });
  }

  async updateClient(updateData: UpdateClientInput): Promise<ClientInterface> {
    const {
      id,
      type,
      status,
      gender,
      age,
      firstName,
      lastName,
      email,
      weight,
      phone,
      address,
      withHandCameraVideo,
      withCameraman,
      paymentStatus,
      tmId,
      cameramanId,
      date,
      notes,
      certificate,
    } = updateData;

    const client = await this.clientModel.findOne({ id: updateData.id });

    if (!client) {
      throw new BadRequestException(`Passenger with id: ${id} doesnt exists`);
    }

    if (status) {
      client.status = status;
    }

    if (type) {
      client.type = type;
    }

    if (age) {
      client.age = age;
    }

    if (gender) {
      client.gender = gender;
    }

    if (weight) {
      client.weight = weight;
    }

    if (firstName) {
      client.firstName = firstName;
    }

    if (lastName) {
      client.lastName = lastName;
    }

    if (email) {
      client.email = email;
    }

    if (phone) {
      client.phone = phone;
    }

    if (email) {
      client.email = email;
    }

    if (address) {
      client.address = address;
    }

    if (withHandCameraVideo !== undefined) {
      client.withHandCameraVideo = withHandCameraVideo;
    }

    if (withCameraman !== undefined) {
      client.withCameraman = withCameraman;
    }

    if (paymentStatus) {
      client.paymentStatus = paymentStatus;
    }


    let tm: MemberInterface | null = null;
    let cameraman: MemberInterface | null = null;

    if (client.type === ClientType.TANDEM) {
      if (tmId) {
        tm = await this.memberModel.findOne({ id: tmId }).exec();
        client.tm = tm;
      }
      if (cameramanId) {
        cameraman = await this.memberModel.findOne({ id: cameramanId }).exec();
        client.cameraman = cameraman;
      }
    } else {
      client.tm = null;
      client.cameraman = null;
    }


    if (date) {
      client.date = date;
    }

    if (notes) {
      client.notes = notes;
    }

    if (certificate) {
      client.certificate = certificate;
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
