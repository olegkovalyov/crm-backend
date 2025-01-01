import {ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class AuthTokenModel {
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
  ): AuthTokenModel {
    return new AuthTokenModel(
      accessToken,
      refreshToken,
    );
  }
}
