import { Mapper } from "@be/infrastructure/mappers/Mapper";
import { AdRepository } from "../../../../domain/repositories/AdRepository";
import { ReadAdDto } from "../dtos/ReadAdDto";

export class GetAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(id: number): Promise<ReadAdDto | null> {
    const ad = await this.adRepo.findById(id);
    return ad ? Mapper.toReadAdDto(ad) : null;
  }
}