import { Ad } from "../../../../domain/entities/Ad";
import { AdRepository } from "../../../../domain/repositories/AdRepository";

export class GetAdListUseCase {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(): Promise<Ad[]> {
    return await this.adRepo.findAll();
  }
}