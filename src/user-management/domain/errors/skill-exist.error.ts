import {DomainError} from '../../../shared/domain/common/domain-error.class';
import {Skill} from '../value-objects/skill.value-object';

export class SkillExistError extends DomainError {
  public constructor(skill: Skill) {
    super(`Skill "${skill}" already exist for current member`);
  }
}