import { Field, InputType } from '@nestjs/graphql';
import { ArrayUnique, IsOptional } from 'class-validator';
import { ClientStatus, PaymentStatus } from '../../interfaces/client.interface';

@InputType()
export class GetClientsFilterInput {

  @Field(type => [ClientStatus])
  @IsOptional()
  @ArrayUnique()
  clientStatuses?: ClientStatus[];

  @Field(type => [PaymentStatus])
  @IsOptional()
  @ArrayUnique()
  paymentStatuses?: PaymentStatus[];

  @Field()
  @IsOptional()
  createdAtMin?: Date;

  @Field()
  @IsOptional()
  createdAtMax?: Date;
}
