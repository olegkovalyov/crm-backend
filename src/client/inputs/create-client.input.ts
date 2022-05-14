import {Field, InputType} from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import {ClientRole, ClientStatus, Gender, PaymentStatus} from '../interfaces/client.interface';

@InputType()
export class CreateClientInput {

  @Field(type => ClientRole)
  @IsEnum(ClientRole)
  @IsOptional()
  role?: ClientRole;

  @Field(type => ClientStatus)
  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @Field(type => PaymentStatus)
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @Field(type => Gender)
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @Field(type => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  firstName?: string;

  @Field()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  lastName?: string;

  @Field({nullable: true})
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field()
  @IsOptional()
  @IsInt()
  weight?: number;

  @Field()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  phone?: string;

  @Field()
  @IsOptional()
  additionalInfo?: string;

  @Field()
  @IsOptional()
  certificate?: string;
}
