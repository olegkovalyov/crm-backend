import {AggregateRoot} from '../../../shared/domain/entities/aggregate-root.class';
import {Guid} from 'guid-typescript';
import {IdentityInfo} from '../value-objects/identity-info.value-object';
import {Result} from '../../../shared/domain/common/result.class';
import {Skill} from '../value-objects/skill.value-object';

export class Member extends AggregateRoot {
  private _identityInfo: IdentityInfo;
  private _skills: Skill[];
  private permissions: string[];

  private constructor(
    id: Guid | null,
    identityInfo: IdentityInfo,
    skills: Skill[],
    permissions: string[],
  ) {
    id ? super(id) : super();
    this._identityInfo = identityInfo;
    this._skills = skills;
  }

  public static create(
    id: Guid | null,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumbers: string[],
    skills: string[],
    permissions: string[],
  ): Result<Member> {
    // Create Identity
    const identityInfoResult = IdentityInfo.create(
      firstName,
      lastName,
      email,
      phoneNumbers,
    );
    if (identityInfoResult.isFailure) {
      return new Result<Member>(false, identityInfoResult.error);
    }

    //Create skills
    const validatedSkills: Skill[] = [];
    for (const skill of skills) {
      const result = Skill.create(skill);
      if (result.isFailure) {
        return new Result<Member>(false, result.error);
      }
      if (!validatedSkills.includes(result.getValue())) {
        validatedSkills.push(result.getValue());
      }
    }

    // Create new Member
    const member = new Member(
      id,
      identityInfoResult.getValue(),
      validatedSkills,
      permissions,
    );

    // Return success
    return new Result<Member>(true, null, member);
  }

  get identityInfo(): IdentityInfo {
    return this._identityInfo;
  }

  private set identityInfo(value: IdentityInfo) {
    this._identityInfo = value;
  }
}