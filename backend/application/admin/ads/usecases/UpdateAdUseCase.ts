import { Ad } from "../../../../domain/entities/Ad";
import { AdRepository } from "../../../../domain/repositories/AdRepository";

export class UpdateAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(id: number, updateData: Partial<Ad>): Promise<void> {
    const safeUpdateData = { ...updateData };
    delete safeUpdateData.userId;
    await this.adRepo.update(id, safeUpdateData);
  }
}