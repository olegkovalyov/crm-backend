import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoadModel } from '../models/load.model';
import { LoadService } from '../services/load.service';
import { CreateLoadInput } from '../inputs/loads/create-load.input';
import { EventModel } from '../models/event.model';
import { GetEventsFilterInput } from '../inputs/events/get-events-filter.input';

@Resolver(of => LoadModel)
export class LoadResolver {
  constructor(
    private readonly loadService: LoadService,
  ) {
  }

  @Query(returns => [LoadModel])
  async getLoads(@Args('eventId', { type: () => Int }) eventId: number): Promise<LoadModel[]> {
    const loadEntities = await this.loadService.getLoads(eventId);
    const loadModels = await Promise.all(
      loadEntities.map(loadEntity => this.loadService.transformToGraphQlLoadModel(loadEntity)),
    );
    return loadModels;
  }

  @Mutation(returns => LoadModel)
  async createLoad(@Args('createLoadInput') createData: CreateLoadInput): Promise<LoadModel> {
    const load = await this.loadService.createLoad(createData);
    return this.loadService.transformToGraphQlLoadModel(load);
  }

  //
  // @Query(returns => [LoadModel])
  // async getLoads(@Args('eventId') eventId: string): Promise<ILoad[]> {
  //   return this.loadService.getLoads(eventId);
  // }

  // @Mutation(returns => LoadModel)
  // async updateLoad(@Args('updateLoadData') updateData: UpdateLoadInput): Promise<ILoad> {
  //   return this.loadService.updateLoad(updateData);
  // }
  //
  // @Mutation(returns => LoadModel, { nullable: true })
  // async removeLoad(@Args('id') id: string) {
  //   return this.loadService.removeLoadById(id);
  // }
}
