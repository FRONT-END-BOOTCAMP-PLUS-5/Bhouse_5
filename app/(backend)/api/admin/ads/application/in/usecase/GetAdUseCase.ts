import { GetAdUseCasePort } from '../port/in/GetAdUseCasePort';
import { AdRepository } from '../../out/port/out/AdRepository';
import { Ad } from '../../../domain/model/Ad';

export class GetAdUseCase implements GetAdUseCasePort {
  constructor(private readonly adRepo: AdRepository) {}
  async execute(id: number): Promise<Ad | null> {
    return await this.adRepo.findById(id);
  }
}