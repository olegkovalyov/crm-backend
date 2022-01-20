import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class GetSlotsInput {

  @Field()
  loadId: number;
}
