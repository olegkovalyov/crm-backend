import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '../../../users/interfaces/user.interface';

@InputType()
export class SlotInput {
  @Field(type => Int)
  userId: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(type => UserRole)
  role: typeof UserRole;

  @Field()
  description: string;
}
