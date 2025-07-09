import { Ad } from "../../../../domain/model/Ad";

export interface CreateAdUseCasePort {
  execute(ad: Ad): Promise<void>;
}