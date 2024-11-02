import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
