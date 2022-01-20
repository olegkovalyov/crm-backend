import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {LoadModel} from '../models/load.model';
import {LoadService} from '../services/load.service';
import {CreateLoadInput} from '../inputs/loads/create-load.input';
import {BadRequestException} from '@nestjs/common';
import {EventService} from '../services/event.service';
import {GraphqlService} from '../services/graphql.service';
import {sprintf} from 'sprintf-js';
import {ERR_LOAD_NOT_FOUND} from '../constants/load.error';
import {UpdateLoadInput} from '../inputs/loads/update-load.input';

@Resolver(() => LoadModel)
export class LoadResolver {
  constructor(
    private readonly loadService: LoadService,
    private readonly eventService: EventService,
    private readonly graphQlService: GraphqlService,
  ) {
  }

  @Query(() => [LoadModel])
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getLoads(@Args('eventId', {type: () => Int}) eventId: number): Promise<LoadModel[]> {
    const loads = await this.loadService.getLoads(eventId);
    return loads.map(load => this.graphQlService.constructLoadModel(load));
  }

  @Query(() => LoadModel, {nullable: true})
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async getLoad(@Args('id', {type: () => Int}) id: number): Promise<LoadModel> {
    const load = await this.loadService.getLoadById(id);
    if (!load) {
      throw new BadRequestException(sprintf(ERR_LOAD_NOT_FOUND, id));
    }
    return this.graphQlService.constructLoadModel(load);
  }

  @Mutation(() => LoadModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async createLoad(@Args('createLoadInput') createLoadData: CreateLoadInput): Promise<LoadModel> {
    const load = await this.loadService.createLoad(createLoadData);
    return this.graphQlService.constructLoadModel(load);
  }

  @Mutation(() => LoadModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async deleteLoad(@Args('id', {type: () => Int}) id: number): Promise<LoadModel> {
    const load = await this.loadService.deleteLoadById(id);
    return this.graphQlService.constructLoadModel(load);
  }

  @Mutation(() => LoadModel)
  // @UseGuards(JwtAuthGuard, IsAdminOrManifestGuard)
  async updateLoad(@Args('updateLoadInput') updateLoadData: UpdateLoadInput): Promise<LoadModel> {
    const updatedLoad = await this.loadService.updateLoad(updateLoadData);
    return this.graphQlService.constructLoadModel(updatedLoad);
  }
}
