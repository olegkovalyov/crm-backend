import {Field, InputType} from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional, Max,
  MaxLength, Min,
  MinLength,
} from 'class-validator';
import {ClientStatus, ClientRole, Gender} from '../../interfaces/client.interface';

@InputType()
export class CreateClientInput {

  @Field(type => ClientRole)
  @IsEnum(ClientRole)
  role: ClientRole;

  @Field(type => ClientStatus)
  @IsEnum(ClientStatus)
  status: ClientStatus;

  @Field(type => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field()
  @IsInt()
  @Min(3)
  @Max(100)
  age: number;

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
  email: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  weight: number;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  withHandCameraVideo: boolean;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  withCameraman: boolean;

  @Field({nullable: true})
  @IsOptional()
  notes: string;

  @Field({nullable: true})
  @IsOptional()
  certificate: string;
}
