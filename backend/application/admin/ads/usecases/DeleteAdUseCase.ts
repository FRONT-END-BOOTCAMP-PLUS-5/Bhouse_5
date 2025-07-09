import { AdRepository } from "../../../../domain/repositories/AdRepository";

export class DeleteAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(id: number): Promise<void> {
    await this.adRepo.delete(id);
  }
}