import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoadModel } from '../models/load.model';
import { LoadService } from '../services/load.service';
import { CreateLoadInput } from '../inputs/loads/create-load.input';
import { BadRequestException } from '@nestjs/common';
import { UpdateLoadInput } from '../inputs/loads/update-load.input';

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

  @Query(returns => LoadModel, { nullable: true })
  async getLoad(@Args('id', { type: () => Int }) id: number): Promise<LoadModel> {
    const load = await this.loadService.getLoadById(id);
    if (!load) {
      throw new BadRequestException('Load not found');
    }
    return this.loadService.transformToGraphQlLoadModel(load);
  }

  @Mutation(returns => LoadModel)
  async createLoad(@Args('createLoadInput') createData: CreateLoadInput): Promise<LoadModel> {
    const load = await this.loadService.createLoad(createData);
    return this.loadService.transformToGraphQlLoadModel(load);
  }

  @Mutation(returns => LoadModel)
  async updateLoad(@Args('updateLoadInput') updateData: UpdateLoadInput): Promise<LoadModel> {
    const updatedLoad = await this.loadService.updateLoad(updateData);
    return this.loadService.transformToGraphQlLoadModel(updatedLoad);
  }

  @Mutation(returns => Boolean)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteLoad(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.loadService.deleteLoadById(id);
  }
}
