import { StoreRepository } from "@be/domain/repositories/StoreRepository";
import { Store } from "@be/domain/entities/Store";

export class GetStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}
  async execute(id: number): Promise<Store | null> {
    return await this.storeRepo.findById(id);
  }
}