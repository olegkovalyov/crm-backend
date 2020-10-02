import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoadModel } from '../models/load.model';
import { LoadService } from '../services/load.service';
import { ILoad } from '../interfaces/load.interface';
import { CreateLoadInput } from '../inputs/create-load.input';
import { UpdateLoadInput } from '../inputs/update-load.input';

@Resolver(of => LoadModel)
export class LoadResolver {
  constructor(
    private readonly loadService: LoadService,
  ) {
  }

  @Query(returns => [LoadModel], { nullable: 'items' })
  async getLoads(): Promise<ILoad[]> {
    return this.loadService.getLoads();
  }

  @Mutation(returns => LoadModel)
  async createLoad(@Args('createLoadData') createData: CreateLoadInput): Promise<ILoad> {
    return this.loadService.createLoad(createData);
  }

  @Mutation(returns => LoadModel)
  async updateLoad(@Args('updateLoadData') updateData: UpdateLoadInput): Promise<ILoad> {
    return this.loadService.updateLoad(updateData);
  }

  @Mutation(returns => LoadModel, { nullable: true })
  async removeLoad(@Args('id') id: string) {
    return this.loadService.removeLoadById(id);
  }
}
