import {Field, InputType} from '@nestjs/graphql';
import {ArrayUnique, IsOptional} from 'class-validator';
import {ClientStatus} from '../../interfaces/client.interface';

@InputType()
export class GetClientsFilterInput {

  @Field(type => [ClientStatus])
  @IsOptional()
  @ArrayUnique()
  clientStatusOptions?: ClientStatus[];

  @Field()
  @IsOptional()
  isAssigned?: boolean;

  @Field()
  @IsOptional()
  createdAtMin?: Date;

  @Field()
  @IsOptional()
  createdAtMax?: Date;
}
