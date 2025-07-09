import { AdRepository } from "../../out/port/out/AdRepository";
import { DeleteAdUseCasePort } from "../port/in/DeleteAdUseCasePort";

export class DeleteAdUseCase implements DeleteAdUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(id: number): Promise<void> {
    await this.adRepo.delete(id);
  }
}