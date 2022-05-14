import {Field, InputType, Int} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate, IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional, Max,
  MaxLength, Min,
  MinLength,
} from 'class-validator';
import {ClientRole, ClientStatus, Gender, PaymentStatus} from '../interfaces/client.interface';

@InputType()
export class UpdateClientInput {

  @Field(type => Int)
  @IsNotEmpty()
  id: number;

  @Field(type => ClientRole)
  role: ClientRole;

  @Field(type => ClientStatus)
  @IsEnum(ClientStatus)
  status: ClientStatus;

  @Field(type => PaymentStatus)
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(type => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field(type => Date)
  @IsDate()
  dateOfBirth: Date;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @Field({nullable: true})
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @Field({nullable: true})
  @IsOptional()
  additionalInfo?: string;

  @Field({nullable: true})
  @IsOptional()
  certificate?: string;

  @Field(type => Date)
  @IsDate()
  @IsOptional()
  processedAt?: Date;
}
