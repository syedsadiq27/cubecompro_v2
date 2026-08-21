import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateLibraryFolderInput,
  CreateMaterialAssetInput,
  CreateObjectAssetInput,
  CreateObjectAssetRevisionInput,
  CreateTextureAssetInput,
  LibraryFolderModel,
  MaterialAssetModel,
  MaterialAssetRevisionModel,
  ObjectAssetModel,
  ObjectAssetRevisionModel,
  TextureAssetModel,
  UpdateMaterialAssetInput,
  UpdateObjectAssetStatusInput,
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

  @Mutation(() => MaterialAssetModel)
  updateMaterialAsset(@Args('input') input: UpdateMaterialAssetInput) {
    return this.library.updateMaterial(input);
  }

  @Mutation(() => MaterialAssetModel)
  publishMaterialAsset(@Args('id') id: string) {
    return this.library.publishMaterial(id);
  }

  @Query(() => [MaterialAssetModel])
  materialAssets(@Args('projectId') projectId: string) {
    return this.library.listMaterials(projectId);
  }

  @Query(() => [MaterialAssetRevisionModel])
  materialAssetRevisions(@Args('materialAssetId') materialAssetId: string) {
    return this.library.listMaterialRevisions(materialAssetId);
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

  @Mutation(() => ObjectAssetRevisionModel)
  createObjectAssetRevision(
    @Args('input') input: CreateObjectAssetRevisionInput
  ) {
    return this.library.createObjectRevision(input);
  }

  @Mutation(() => ObjectAssetRevisionModel)
  publishObjectAsset(@Args('id') id: string) {
    return this.library.publishObject(id);
  }

  @Mutation(() => ObjectAssetModel)
  updateObjectAssetStatus(@Args('input') input: UpdateObjectAssetStatusInput) {
    return this.library.updateObjectStatus(input);
  }

  @Query(() => [ObjectAssetRevisionModel])
  objectAssetRevisions(@Args('objectAssetId') objectAssetId: string) {
    return this.library.listObjectRevisions(objectAssetId);
  }

  @Query(() => [ObjectAssetModel])
  objectAssets(@Args('projectId') projectId: string) {
    return this.library.listObjects(projectId);
  }

  @Query(() => ObjectAssetModel)
  objectAsset(@Args('id') id: string) {
    return this.library.getObject(id);
  }

  @Mutation(() => Boolean)
  deleteObjectAsset(@Args('id') id: string) {
    return this.library.deleteObject(id);
  }
}
