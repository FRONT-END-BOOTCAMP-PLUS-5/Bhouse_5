import { Ad } from "../../../../domain/model/Ad";

export interface UpdateAdUseCasePort {
  execute(ad: Ad): Promise<void>;
}