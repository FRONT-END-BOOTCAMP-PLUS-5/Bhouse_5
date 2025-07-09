import { GetAdUseCasePort } from '../../application/in/port/in/GetAdUseCasePort';
import { GetAdListUseCasePort } from '../../application/in/port/in/GetAdListUseCasePort';
import { CreateAdUseCasePort } from '../../application/in/port/in/CreateAdUseCasePort';

import { Ad } from '../../domain/model/Ad';
import { UpdateAdUseCasePort } from '../../application/in/port/in/UpdateAdUseCasePort';
import { DeleteAdUseCasePort } from '../../application/in/port/in/DeleteAdUseCasePort';

// DTO interfaces for request data
interface CreateAdRequest {
  id: number;
  title: string;
  imgUrl: string;
  redirectUrl: string;
  isActive: boolean;
}

interface UpdateAdRequest {
  title: string;
  imgUrl: string;
  redirectUrl: string;
  isActive: boolean;
}

export class AdController {
  constructor(
    private readonly getAdUseCase: GetAdUseCasePort,
    private readonly getAdListUseCase: GetAdListUseCasePort,
    private readonly createAdUseCase: CreateAdUseCasePort,
    private readonly updateAdUseCase: UpdateAdUseCasePort,
    private readonly deleteAdUseCase: DeleteAdUseCasePort
  ) {}

  async getAd(id: number) {
    return await this.getAdUseCase.execute(id);
  }

  async getAllAds() {
    return await this.getAdListUseCase.execute();
  }

  async createAd(data: CreateAdRequest) {
    const { id, title, imgUrl, redirectUrl, isActive } = data;
    const ad = new Ad(id, title, imgUrl, redirectUrl, isActive);
    await this.createAdUseCase.execute(ad);
  }

  async updateAd(id: number, data: UpdateAdRequest) {
    const { title, imgUrl, redirectUrl, isActive } = data;
    const ad = new Ad(id, title, imgUrl, redirectUrl, isActive);
    await this.updateAdUseCase.execute(ad);
  }

  async deleteAd(id: number) {
    await this.deleteAdUseCase.execute(id);
  }
}