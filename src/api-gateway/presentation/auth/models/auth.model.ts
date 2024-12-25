import {ObjectType, Field} from '@nestjs/graphql';

@ObjectType()
export class Auth {
  private constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    accessToken: string | null = null,
    refreshToken: string | null = null,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({nullable: true})
  accessToken: string;

  @Field({nullable: true})
  refreshToken: string;

  static create(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    accessToken: string | null = null,
    refreshToken: string | null = null,
  ): Auth {
    return new Auth(
      id,
      email,
      firstName,
      lastName,
      accessToken,
      refreshToken,
    );
  }
}
