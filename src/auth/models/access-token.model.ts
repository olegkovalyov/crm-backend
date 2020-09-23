import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenModel {
  @Field({ nullable: true })
  accessToken: string;
}


