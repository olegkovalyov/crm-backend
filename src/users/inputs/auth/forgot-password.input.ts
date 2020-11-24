import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ForgotPasswordInput {

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
