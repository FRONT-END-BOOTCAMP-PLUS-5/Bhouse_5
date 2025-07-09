import { CreateAdUseCasePort } from "../port/in/CreateAdUseCasePort";
import { AdRepository } from "../../out/port/out/AdRepository";
import { Ad } from "../../../domain/model/Ad";

export class CreateAdUseCase implements CreateAdUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}

  async execute(ad: Ad): Promise<void> {
    await this.adRepo.create(ad);
  }
}