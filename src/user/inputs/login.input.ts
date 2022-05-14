import {InputType, OmitType} from '@nestjs/graphql';
import {UserInput} from '../../common/inputs/user.input';

@InputType()
export class LoginInput extends OmitType(
  UserInput,
  [
    'id',
    'role',
    'firstName',
    'lastName',
    'licenseType',
    'status',
  ] as const,
) {
}
