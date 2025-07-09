import { GetAdListUseCasePort } from "../port/in/GetAdListUseCasePort";
import { AdRepository } from "../../out/port/out/AdRepository";
import { Ad } from "../../../domain/model/Ad";

export class GetAdListUseCase implements GetAdListUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(): Promise<Ad[]> {
    return await this.adRepo.findAll();
  }
}