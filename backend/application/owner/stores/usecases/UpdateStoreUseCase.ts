import { StoreRepository } from "@be/domain/repositories/StoreRepository";
import { Store } from "@be/domain/entities/Store";

export class UpdateStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) {}

  async execute(
    storeId: number,
    userId: string,
    userRole: "admin" | "user",
    updateData: Partial<Store>
  ): Promise<void> {
    const store = await this.storeRepo.findById(storeId);
    if (!store) {
      throw new Error("존재하지 않는 매장입니다.");
    }

    const isAdmin = userRole === "admin";
    const isOwner = store.createdBy === userId;

    if (!isAdmin && !isOwner) {
      throw new Error("해당 매장을 수정할 권한이 없습니다.");
    }

    const safeUpdateData = { ...updateData };
    delete safeUpdateData.createdBy; // createdBy는 수정 못함

    await this.storeRepo.update(storeId, store.createdBy, safeUpdateData);
  }
}