import {InputType, OmitType} from '@nestjs/graphql';
import {UserInput} from '../../common/inputs/user.input';

@InputType()
export class CreateUserInput extends OmitType(
  UserInput,
  [
    'id',
  ] as const,
) {
}
