import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateLibraryFolderInput,
  CreateMaterialAssetInput,
  CreateObjectAssetInput,
  CreateTextureAssetInput,
  LibraryFolderModel,
  MaterialAssetModel,
  ObjectAssetModel,
  TextureAssetModel,
} from '../graphql/models';
import { LibraryService } from './library.service';

@Resolver()
export class LibraryResolver {
  constructor(private readonly library: LibraryService) {}

  @Mutation(() => LibraryFolderModel)
  createLibraryFolder(@Args('input') input: CreateLibraryFolderInput) {
    return this.library.createFolder(input);
  }

  @Query(() => [LibraryFolderModel])
  libraryFolders(
    @Args('projectId') projectId: string,
    @Args('parentId', { nullable: true }) parentId?: string
  ) {
    return this.library.listFolders(projectId, parentId ?? null);
  }

  @Mutation(() => MaterialAssetModel)
  createMaterialAsset(@Args('input') input: CreateMaterialAssetInput) {
    return this.library.createMaterial(input);
  }

  @Query(() => [MaterialAssetModel])
  materialAssets(@Args('projectId') projectId: string) {
    return this.library.listMaterials(projectId);
  }

  @Mutation(() => TextureAssetModel)
  createTextureAsset(@Args('input') input: CreateTextureAssetInput) {
    return this.library.createTexture(input);
  }

  @Query(() => [TextureAssetModel])
  textureAssets(@Args('projectId') projectId: string) {
    return this.library.listTextures(projectId);
  }

  @Mutation(() => Boolean)
  deleteTextureAsset(@Args('id') id: string) {
    return this.library.deleteTexture(id);
  }

  @Mutation(() => ObjectAssetModel)
  createObjectAsset(@Args('input') input: CreateObjectAssetInput) {
    return this.library.createObject(input);
  }

  @Query(() => [ObjectAssetModel])
  objectAssets(@Args('projectId') projectId: string) {
    return this.library.listObjects(projectId);
  }

  @Mutation(() => Boolean)
  deleteObjectAsset(@Args('id') id: string) {
    return this.library.deleteObject(id);
  }
}
