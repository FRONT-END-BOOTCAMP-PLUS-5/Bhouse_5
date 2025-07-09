import { Ad } from "../../../../domain/model/Ad";

export interface UpdateAdUseCasePort {
  execute(id: number, updateData: Partial<Ad>): Promise<void>;
}