import {InputType, OmitType, PartialType} from '@nestjs/graphql';
import {UserInput} from '../../common/inputs/user.input';

@InputType()
export class UpdateUserInput extends OmitType(
  PartialType(UserInput),
  ['password'] as const,
) {}
