import {DomainError} from '../../../shared/domain/common/domain-error.class';

export class EmailInvalidError extends DomainError {
  public constructor(email: string) {
    super(`Email "${email}" is invalid`);
  }
}