import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordModel {
  @Field()
  wasSentEmail: boolean;
}


