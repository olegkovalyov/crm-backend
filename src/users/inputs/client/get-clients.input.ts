import {Field, InputType} from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDate,
  IsOptional,
} from 'class-validator';
import {ClientRole, ClientStatus, Gender, PaymentStatus} from '../../interfaces/client.interface';

@InputType()
export class GetClientsInput {

  @Field(type => [ClientRole])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  role?: ClientRole[];

  @Field(type => [ClientStatus])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  status?: ClientStatus[];

  @Field(type => [PaymentStatus])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  paymentStatus?: PaymentStatus[];

  @Field(type => [Gender])
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  gender?: Gender[];

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  minDateOfBirth?: Date;

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  maxDateOfBirth?: Date;

  @Field(type => String)
  @IsOptional()
  firstName?: string;

  @Field(type => String)
  @IsOptional()
  lastName?: string;

  @Field(type => String)
  @IsOptional()
  email?: string;

  @Field(type => String)
  @IsOptional()
  phone?: string;

  @Field(type => String)
  @IsOptional()
  certificate?: string;

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  minCreatedAt?: Date;

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  maxCreatedAt?: Date;

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  minProcessedAt?: Date;

  @Field(type => Date)
  @IsOptional()
  @IsDate()
  maxProcessedAt?: Date;
}
