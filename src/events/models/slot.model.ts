import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../users/interfaces/user.interface';

@ObjectType()
export class SlotModel {

  @Field(type => Int)
  id: number;

  @Field(type => Int)
  userId: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  description: string;

  @Field(type => UserRole)
  role: typeof UserRole;
}
