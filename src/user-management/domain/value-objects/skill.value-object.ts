import {ValueObject} from '../../../shared/domain/value-objects/value-object.class';
import {Result} from '../../../shared/domain/common/result.class';
import {SkillInvalidError} from '../errors/skill-invalid.error';

const skills = [
  'SKYDIVER',
  'TANDEM_INSTRUCTOR',
  'AFF_INSTRUCTOR',
  'COACH',
  'CAMERAMAN',
  'PACKER',
  'RIGGER',
] as const;

export type SkillType = typeof skills[number];

export class Skill extends ValueObject {
  private readonly _skill: string;

  protected constructor(
    skill: SkillType,
  ) {
    super();
    this._skill = skill;
  }

  public static create(skill: string): Result<Skill> {
    if (!Skill.isValidSkill(skill)) {
      return new Result<Skill>(false, new SkillInvalidError(skill));
    }

    return new Result<Skill>(true, null, new Skill(skill));
  }

  private static isValidSkill(skill: string): skill is SkillType {
    return skills.includes(skill as SkillType);
  }

  public getName(): string {
    return this._skill;
  }
}