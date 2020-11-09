import { Field, InputType } from '@nestjs/graphql';
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
import { ClientStatus, ClientType, Gender, PaymentStatus } from '../interfaces/client.interface';

@InputType()
export class UpdateClientInput {

  @Field()
  @IsNotEmpty()
  id: string;

  @Field(type => ClientType)
  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType;

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

  @Field({ nullable: true })
  @IsOptional()
  tmId?: string;

  @Field({ nullable: true })
  @IsOptional()
  cameramanId?: string;

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
