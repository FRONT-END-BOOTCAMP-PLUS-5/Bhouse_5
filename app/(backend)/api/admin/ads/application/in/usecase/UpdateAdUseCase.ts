import { Ad } from "../../../domain/model/Ad";
import { AdRepository } from "../../out/port/out/AdRepository";
import { UpdateAdUseCasePort } from "../port/in/UpdateAdUseCasePort";

export class UpdateAdUseCase implements UpdateAdUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(ad: Ad): Promise<void> {
    await this.adRepo.update(ad);
  }
}