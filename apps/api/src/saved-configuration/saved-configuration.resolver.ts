import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SaveConfigurationInput,
  SavedConfigurationModel,
} from '../graphql/models';
import { SavedConfigurationService } from './saved-configuration.service';

@Resolver(() => SavedConfigurationModel)
export class SavedConfigurationResolver {
  constructor(private readonly saved: SavedConfigurationService) {}

  @Mutation(() => SavedConfigurationModel)
  saveConfiguration(@Args('input') input: SaveConfigurationInput) {
    return this.saved.save(input);
  }

  @Query(() => SavedConfigurationModel)
  savedConfiguration(@Args('id') id: string) {
    return this.saved.getById(id);
  }
}
