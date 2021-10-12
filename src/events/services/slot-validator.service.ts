import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Load} from '../entities/load.entity';
import {User} from '../../users/entities/user.entity';
import {SlotService} from './slot.service';

@Injectable()
export class SlotValidatorService {

  constructor(
    @Inject(forwardRef(() => SlotService))
    private readonly slotService: SlotService,
  ) {
  }

  //
  // async userAlreadyExistInLoad(user: User, load: Load): Promise<boolean> {
  //   const slots = await this.slotService.getSlots(load.id);
  //   let exist = false;
  //   slots.forEach(slot => {
  //     if (slot.userIds.includes(user.id)) {
  //       exist = true;
  //     }
  //   });
  //   return exist;
  // }
  //
  // async validateTandemSlot(users: User[], load: Load, withCameraman = true): Promise<void> {
  //   const userLength = withCameraman ? 3 : 2;
  //
  //   if (users.length !== userLength) {
  //     throw new BadRequestException(`Slot should contain ${userLength} persons.`);
  //   }
  //   let tmExists = false;
  //   let tmPassengerExists = false;
  //   let cameramanExists = false;
  //
  //   for (const user of users) {
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //
  //     if (user.userType === UserType.MEMBER) {
  //       const member = await this.memberService.getMemberByUserId(user.id);
  //       if (member.roles.includes(MemberRole.TM)
  //         && !tmExists
  //       ) {
  //         tmExists = true;
  //         continue;
  //       }
  //       if (member.roles.includes(MemberRole.CAMERAMAN)
  //         && !cameramanExists
  //         && withCameraman
  //       ) {
  //         cameramanExists = true;
  //       }
  //     } else {
  //       const client = await this.clientService.getClientByUserId(user.id);
  //       if (client) {
  //         tmPassengerExists = true;
  //       }
  //     }
  //   }
  //
  //   if (!tmExists) {
  //     throw new BadRequestException(`TM doesnt exists in current load`);
  //   }
  //
  //   if (!tmPassengerExists) {
  //     throw new BadRequestException(`TM passenger doesnt exists in current load`);
  //   }
  //
  //   if (!cameramanExists
  //     && withCameraman) {
  //     throw new BadRequestException(`Cameraman doesnt exists in current load`);
  //   }
  // }
  //
  // async validateSportSlot(users: User[], load: Load): Promise<boolean> {
  //   for (const user of users) {
  //     const member = await this.memberService.getMemberByUserId(user.id);
  //     if (!member
  //       || !member.roles.includes(MemberRole.SKYDIVER)
  //     ) {
  //       throw new BadRequestException(`User with id ${user.id} has no access for sport jumps`);
  //     }
  //
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //   }
  // }
  //
  // async checkSkydiverRole(users: User[]): Promise<boolean> {
  //   const hasRole = true;
  //   for (const user of users) {
  //     const member = await this.memberService.getMemberByUserId(user.id);
  //     if (!member
  //       || !member.roles.includes(MemberRole.SKYDIVER)
  //     ) {
  //       hasRole = false;
  //     }
  //   }
  //   return hasRole
  // }
  //
  //
  // async validateStaticLineSlot(users: User[], load: Load): Promise<void> {
  //   if (users.length === 0) {
  //     throw new BadRequestException(`Slot should contain at least 1 performer.`);
  //   }
  //   for (const user of users) {
  //     const client = await this.clientService.getClientByUserId(user.id);
  //     if (!client
  //       || client.role !== ClientRole.STATIC_LINE
  //     ) {
  //       throw new BadRequestException(`User with id: ${user.id} has no Static Line role`);
  //     }
  //
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //   }
  // }
  //
  // async validateAffSlot(users: User[], load: Load, multipleInstructors = true): Promise<void> {
  //   const userLength = multipleInstructors ? 3 : 2;
  //   if (users.length !== userLength) {
  //     throw new BadRequestException(`Slot should contain ${userLength} persons.`);
  //   }
  //   let studentExist = false;
  //   let firstInstructorExist = false;
  //   let secondInstructorExist = false;
  //   for (const user of users) {
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //
  //     const member = await this.memberService.getMemberByUserId(user.id);
  //     if (!member
  //       || (!member.roles.includes(MemberRole.COACH)
  //         && !member.roles.includes(MemberRole.STUDENT)
  //       )
  //     ) {
  //       throw new BadRequestException(`User with id: ${user.id} is not student or instructor`);
  //     }
  //
  //     if (member.roles.includes(MemberRole.STUDENT)) {
  //       studentExist = true;
  //     }
  //
  //     if (member.roles.includes(MemberRole.COACH)) {
  //       if (!firstInstructorExist) {
  //         firstInstructorExist = true;
  //       } else if (multipleInstructors) {
  //         secondInstructorExist = true;
  //       }
  //     }
  //   }
  //
  //   if (!studentExist) {
  //     throw new BadRequestException(`Student doesnt exists in current load`);
  //   }
  //
  //   if (!firstInstructorExist) {
  //     throw new BadRequestException(`AFF coach doesnt exists in current load`);
  //   }
  //
  //   if (!secondInstructorExist
  //     && multipleInstructors
  //   ) {
  //     throw new BadRequestException(`Second AFF coach doesnt exists in current load`);
  //   }
  // }
  //
  // async validateCoachedJumpSlot(users: User[], load: Load): Promise<void> {
  //   if (users.length !== 2) {
  //     throw new BadRequestException(`Slot should contain 2 persons.`);
  //   }
  //   let studentExist = false;
  //   let coachExist = false;
  //   for (const user of users) {
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //
  //     const member = await this.memberService.getMemberByUserId(user.id);
  //     if (!member
  //       || !member.roles.includes(MemberRole.SKYDIVER)
  //     ) {
  //       throw new BadRequestException(`User with id ${user.id} has no access for sport jumps`);
  //     }
  //
  //     if (member.roles.includes(MemberRole.COACH)) {
  //       coachExist = true;
  //     }
  //
  //     if (member.roles.includes(MemberRole.SKYDIVER)
  //       && !member.roles.includes(MemberRole.COACH)) {
  //       studentExist = true;
  //     }
  //   }
  //
  //   if (!studentExist) {
  //     throw new BadRequestException(`Student doesnt exists in current load`);
  //   }
  //
  //   if (!coachExist) {
  //     throw new BadRequestException(`Coach doesnt exists in current load`);
  //   }
  // }
  //
  // async validatePassengerSlot(users: User[], load: Load): Promise<void> {
  //   if (users.length === 0) {
  //     throw new BadRequestException(`Slot should contain at least 1 performer.`);
  //   }
  //   for (const user of users) {
  //     if (await this.userAlreadyExistInLoad(user, load)) {
  //       throw new BadRequestException(`User with id ${user.id} already exists in current load`);
  //     }
  //   }
  // }
  //
  async validateTotalLoadCapacity(usersInSlot: User[], load: Load): Promise<boolean> {
    let isValid = true;
    const slots = await this.slotService.getSlots(load.id);
    let usersInLoad = 0;
    for (const slot of slots) {
      usersInLoad += slot.userIds.length;
    }
    if (usersInLoad + usersInSlot.length > load.capacity) {
      isValid = false;
    }
    return isValid;
  }

  async validateUsersCountInSlot(usersInSlot: User[], requiredCount: number | null = null): Promise<boolean> {
    let isValid = true;
    if (usersInSlot.length === 0) {
      isValid = false;
    }
    if (requiredCount !== null
      && usersInSlot.length !== requiredCount) {
      isValid = false;
    }
    return isValid;
  }
}
