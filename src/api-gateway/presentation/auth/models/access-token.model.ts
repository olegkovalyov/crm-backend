import {ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class AccessToken {
  private constructor(
    accessToken: string,
    refreshToken: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  static create(
    accessToken: string,
    refreshToken: string,
  ): AccessToken {
    return new AccessToken(
      accessToken,
      refreshToken,
    );
  }
}
