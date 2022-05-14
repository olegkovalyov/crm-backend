import {DomainError} from '../../../shared/domain/common/domain-error.class';

export class SkillInvalidError extends DomainError {
  public constructor(skill: string) {
    super(`Skill "${skill}" is invalid`);
  }
}