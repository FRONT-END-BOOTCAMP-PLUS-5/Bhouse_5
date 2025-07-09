import { Ad } from "../../../../domain/model/Ad";

export interface GetAdListUseCasePort {
  execute(): Promise<Ad[]>;
}
