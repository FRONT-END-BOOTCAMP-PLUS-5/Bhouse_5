
import { Mapper } from "@be/infrastructure/mappers/Mapper";
import { AdRepository } from "../../../../domain/repositories/AdRepository";
import { CreateAdDto } from "../dtos/CreatedAdDto";

export class CreateAdUseCase {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(dto: CreateAdDto): Promise<void> {
    const ad = Mapper.toAdEntity(dto); // ✅ DTO를 Entity로 변환
    await this.adRepo.create(ad);
  }
}