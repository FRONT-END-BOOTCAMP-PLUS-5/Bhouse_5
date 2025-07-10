import { UserTownRepository } from "@be/domain/repositories/UserTownRepository";
import { UserTown } from "@be/domain/entities/UserTown";
import { supabaseClient } from "@bUtils/supabaseClient";

const supabase = supabaseClient;

export class UserTownRepositoryImpl implements UserTownRepository {
  async create(userId: string, townName: string): Promise<UserTown> {
    const { data, error } = await supabase
      .from("user_towns")
      .insert({ user_id: userId, town_name: townName })
      .select()
      .single();

    if (error || !data) throw new Error(error.message);
    return new UserTown(data.id, data.user_id, data.town_name, data.created_at);
  }

  async findByUserId(userId: string): Promise<UserTown[]> {
    const { data, error } = await supabase
      .from("user_towns")
      .select("*")
      .eq("user_id", userId);

    if (error || !data) throw new Error(error.message);
    return data.map((t: any) => new UserTown(t.id, t.user_id, t.town_name, t.created_at));
  }

  async delete(id: number, userId: string): Promise<void> {
    const { error } = await supabase
      .from("user_towns")
      .delete()
      .match({ id, user_id: userId });

    if (error) throw new Error(error.message);
  }
}
