import { Ad } from "../../../domain/model/Ad";
import { AdRepository } from "../../out/port/out/AdRepository";
import { UpdateAdUseCasePort } from "../port/in/UpdateAdUseCasePort";

export class UpdateAdUseCase implements UpdateAdUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(id: number, updateData: Partial<Ad>): Promise<void> {
    const safeUpdateData = { ...updateData };
    delete safeUpdateData.userId;
    await this.adRepo.update(id, safeUpdateData);
  }
}