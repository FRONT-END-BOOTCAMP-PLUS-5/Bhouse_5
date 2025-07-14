import { StoreRepository } from '@be/domain/repositories/StoreRepository';
import { UpdateStoreDto } from '../dtos/UpdateStoreDto';
import { ReadStoreDto } from '../dtos/ReadStoreDto';



export class UpdateStoreUseCase {
  constructor(private readonly storeRepo: StoreRepository) { }

  async execute(
    storeId: number,
    userId: string,
    userRole: 'ADMIN' | 'OWNER' | 'USER', // ✅ 깔끔하게 관리
    updateData: UpdateStoreDto,
  ): Promise<void> {
    const isAdmin = userRole === 'ADMIN';
    const selectedStore: ReadStoreDto | null = await this.storeRepo.findById(storeId);
    if (!selectedStore) {
      throw new Error('존재하지 않는 매장입니다');
    }
    const isOwner = selectedStore.createdBy === userId;

    if (!isAdmin && !isOwner) {
      throw new Error('해당 매장을 수정할 권한이 없습니다.');
    }

    await this.storeRepo.update(storeId, selectedStore.createdBy, updateData);
  }
}