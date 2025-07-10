import { UserTown } from "../entities/UserTown";

export interface UserTownRepository {
  create(userId: string, townName: string, lat: number, lng: number): Promise<UserTown>;
  findByUserId(userId: string): Promise<UserTown[]>;
  delete(id: number, userId: string): Promise<void>;
}