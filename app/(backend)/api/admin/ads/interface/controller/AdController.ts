import { Ad } from '../../domain/model/Ad';
import { GetAdUseCasePort } from '../../application/in/port/in/GetAdUseCasePort';
import { GetAdListUseCasePort } from '../../application/in/port/in/GetAdListUseCasePort';
import { CreateAdUseCasePort } from '../../application/in/port/in/CreateAdUseCasePort';
import { UpdateAdUseCasePort } from '../../application/in/port/in/UpdateAdUseCasePort';
import { DeleteAdUseCasePort } from '../../application/in/port/in/DeleteAdUseCasePort';

export class AdController {
  constructor(
    private readonly getAdUseCase: GetAdUseCasePort,
    private readonly getAdListUseCase: GetAdListUseCasePort,
    private readonly createAdUseCase: CreateAdUseCasePort,
    private readonly updateAdUseCase: UpdateAdUseCasePort,
    private readonly deleteAdUseCase: DeleteAdUseCasePort
  ) { }

  async getAd(id: number) {
    return await this.getAdUseCase.execute(id);
  }

  async getAllAds() {
    return await this.getAdListUseCase.execute();
  }

  async createAd(data: Ad) {
    await this.createAdUseCase.execute(data);
  }

  async updateAd(id: number, data: Partial<Ad>) {
    await this.updateAdUseCase.execute(id, data);
  }

  async deleteAd(id: number) {
    await this.deleteAdUseCase.execute(id);
  }
}