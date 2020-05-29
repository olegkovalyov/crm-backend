import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Field()
  @IsNotEmpty()
  @Length(24, 24)
  token: string;
}
