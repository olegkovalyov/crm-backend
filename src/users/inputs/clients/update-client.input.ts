import { Field, InputType, Int } from '@nestjs/graphql';
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
import { ClientStatus, ClientRole, Gender, PaymentStatus } from '../../interfaces/client.interface';

@InputType()
export class UpdateClientInput {

  @Field(type => Int)
  @IsNotEmpty()
  id: number;

  @Field(type => ClientRole)
  @IsOptional()
  @IsEnum(ClientRole)
  type?: ClientRole;

  @Field(type => ClientStatus)
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @Field(type => Gender)
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @Field()
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(100)
  age?: number;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
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
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @Field()
  @IsOptional()
  @IsBoolean()
  withHandCameraVideo?: boolean;

  @Field()
  @IsOptional()
  @IsBoolean()
  withCameraman?: boolean;

  @Field(type => PaymentStatus)
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  tmId: number;

  @Field(type => Int, { nullable: true })
  @IsOptional()
  cameramanId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  processedAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  certificate?: string;
}
