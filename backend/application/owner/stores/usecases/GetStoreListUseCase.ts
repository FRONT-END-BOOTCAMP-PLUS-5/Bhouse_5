import { StoreRepository } from '@be/domain/repositories/StoreRepository'
import { Store } from '@be/domain/entities/Store'
import { ReadStoreDto } from '../dtos/ReadStoreDto';
import { Mapper } from '@be/infrastructure/mappers/Mapper';

export class GetStoreListUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(): Promise<ReadStoreDto[]> {
    const stores = await this.storeRepo.findAll();
    return stores.map(Mapper.toReadStoreDto);
  }
}