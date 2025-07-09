import { Ad } from "../../../../domain/model/Ad";

export interface GetAdUseCasePort {
  execute(id: number): Promise<Ad | null>;
}