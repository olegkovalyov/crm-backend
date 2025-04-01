import {InputType, Field} from '@nestjs/graphql';

@InputType()
export class AccessTokenInput {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
