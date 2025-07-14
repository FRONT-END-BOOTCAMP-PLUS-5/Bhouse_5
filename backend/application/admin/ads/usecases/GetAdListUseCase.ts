import { Mapper } from "@be/infrastructure/mappers/Mapper";
import { AdRepository } from "../../../../domain/repositories/AdRepository";
import { ReadAdDto } from "../dtos/ReadAdDto";

export class GetAdListUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(): Promise<ReadAdDto[]> {
    const ads = await this.adRepo.findAll();
    return ads.map(Mapper.toReadAdDto);
  }
}