import { Ad } from "../../../../domain/entities/Ad";
import { AdRepository } from "../repositories/AdRepository";

export class GetAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(id: number): Promise<Ad | null> {
    return await this.adRepo.findById(id);
  }
}