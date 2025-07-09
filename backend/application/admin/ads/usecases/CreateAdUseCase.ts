
import { Ad } from "../../../../domain/entities/Ad";
import { AdRepository } from "../../../../domain/repositories/AdRepository";

export class CreateAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(ad: Ad): Promise<void> {
    await this.adRepo.create(ad);
  }
}