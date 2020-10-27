import { BadRequestException, Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberInterface, MemberAccessTokenPayloadInterface, MemberRole } from '../interfaces/member.interface';
import { CreateMemberInput } from '../inputs/create-member.input';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UpdateMemberInput } from '../inputs/update-member.input';
import { availableMemberRoles } from '../constants/member.constants';
import { GetMembersFilterInput } from '../inputs/get-members-filter.input';
import { CONTEXT } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class MembersService {
  constructor(
    @Inject(CONTEXT) private context,
    @InjectModel('Member') private memberModel: Model<MemberInterface>,
    private readonly jwtService: JwtService,
  ) {
  }

  async getMembers(filterParams: GetMembersFilterInput): Promise<MemberInterface[]> {
    const conditions = {};

    // const token = this.context.req.header('authorization').slice(7);
    // const decodedToken = this.jwtService.decode(token) as MemberAccessTokenPayloadInterface;
    // if (decodedToken) {
    //   conditions['email'] = { $ne: decodedToken.email };
    // }

    if (filterParams.roles) {
      conditions['roles'] = { $in: filterParams.roles };
    }
    if (filterParams.statuses) {
      conditions['status'] = { $in: filterParams.statuses };
    }

    return this.memberModel.find(conditions).sort({ updatedAt: -1 }).exec();
  }

  async getMemberById(id: string): Promise<MemberInterface> {
    return this.memberModel.findOne({ id: id }).exec();
  }

  async getMemberByEmail(email: string): Promise<MemberInterface> {
    return this.memberModel.findOne({ email });
  }

  async getMembersByRoles(roles: MemberRole[]): Promise<MemberInterface[]> {
    return this.memberModel.find({ roles: { $in: roles } }).exec();
  }

  async removeMemberById(id: string) {
    return this.memberModel.findOneAndDelete({ id: id }).exec();
  }

  async createMember(createMemberInput: CreateMemberInput): Promise<MemberInterface> {
    const { status, firstName, lastName, email, password, roles, licenseType } = createMemberInput;

    if (roles
      && !this.validateRoles(roles)
    ) {
      throw new BadRequestException(`Invalid roles`);
    }

    const memberExists = await this.memberModel.findOne({ email });
    if (memberExists) {
      throw new BadRequestException('Member with this email already exists');
    }

    const salt = await bcrypt.genSalt();

    return this.memberModel.create({
      id: uuid(),
      status,
      firstName,
      lastName,
      email,
      passwordHash: await bcrypt.hash(password, salt),
      passwordSalt: salt,
      resetPasswordToken: null,
      resetPasswordExpirationDate: null,
      roles,
      licenseType,
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString(),
    });
  }

  async updateMember(updateData: UpdateMemberInput): Promise<MemberInterface> {
    const { id, status, firstName, lastName, email, password, roles, licenseType } = updateData;

    if (roles
      && !this.validateRoles(roles)
    ) {
      throw new BadRequestException(`Invalid roles`);
    }

    const member = await this.memberModel.findOne({ id });
    if (!member) {
      throw new BadRequestException(`Member with id: ${id} doesnt exists`);
    }

    if (email) {
      const memberWithEmail = await this.memberModel.findOne({ email });
      if (memberWithEmail
        && memberWithEmail.id !== id
      ) {
        throw new BadRequestException(`Member with email: ${email} already exists`);
      }
      member.email = email;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      member.passwordSalt = newSalt;
      member.passwordHash = newPasswordHash;
    }

    if (status) {
      member.status = status;
    }

    if (firstName) {
      member.firstName = firstName;
    }

    if (lastName) {
      member.lastName = lastName;
    }

    if (roles) {
      member.roles = roles;
    }

    if (licenseType) {
      member.licenseType = licenseType;
    }

    member.updatedAt = new Date();

    return member.save();
  }

  async updateResetPasswordInfo(member: MemberInterface, token: string, password: string = null): Promise<void> {
    if (token) {
      member.resetPasswordToken = token;
      const expTimestamp = Date.now() + 60 * 1000 * 60;
      member.resetPasswordExpirationDate = new Date(expTimestamp);
    } else {
      member.resetPasswordToken = null;
      member.resetPasswordExpirationDate = null;
    }

    if (password) {
      const newSalt = await bcrypt.genSalt();
      const newPasswordHash = await bcrypt.hash(password, newSalt);
      member.passwordSalt = newSalt;
      member.passwordHash = newPasswordHash;
    }

    try {
      await member.save();
    } catch (e) {

    }
  }

  async getMemberByResetToken(token: string): Promise<MemberInterface> {
    return this.memberModel.findOne({ resetPasswordToken: token }).exec();
  }

  private validateRoles(roles: MemberRole[]): boolean {
    let isValid = true;
    roles.every((role) => {
      if (!availableMemberRoles.includes(role)) {
        isValid = false;
      }
    });
    return isValid;
  }
}
